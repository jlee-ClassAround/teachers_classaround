'use server';

import { cojoobooDb } from '@/lib/cojoobooDb';
import { ivyDb } from '@/lib/ivyDb';
import { PaymentStatus } from '@/generated/cojooboo';

/** [유틸리티] 숫자 합계 */
const sum = (nums: Array<number | null | undefined>): number => 
    nums.reduce<number>((acc, n) => acc + (typeof n === 'number' ? n : 0), 0);

/** [유틸리티] 결제 금액 비율 배분 로직 */
function allocateByRatio(items: { key: string; price: number }[], total: number): Map<string, number> {
    const result = new Map<string, number>();
    if (items.length === 0 || total === 0) return result;

    const totalPrice = items.reduce((acc, it) => acc + (it.price || 0), 0);
    if (totalPrice <= 0) {
        items.forEach(it => result.set(it.key, 0));
        return result;
    }

    const allocs = items.map((it) => Math.floor((total * it.price) / totalPrice));
    let remain = total - allocs.reduce((a, b) => a + b, 0);

    let idx = 0;
    while (remain > 0) {
        allocs[idx] += 1;
        remain -= 1;
        idx = (idx + 1) % allocs.length;
    }

    items.forEach((it, i) => result.set(it.key, (result.get(it.key) ?? 0) + allocs[i]));
    return result;
}

/** [유틸리티] 결제 중복 제거 */
function dedupePayments(rows: any[]): any[] {
    const byKey = new Map<string, any>();
    for (const r of rows) {
        const k = r.tossPaymentKey ?? `__NO_KEY__:${r.id}`;
        const prev = byKey.get(k);
        if (!prev || (r.amount > (prev.amount || 0))) byKey.set(k, r);
    }
    return Array.from(byKey.values());
}

/** 📚 강사별 강의 목록 및 매출 조회 (if 문으로 DB 직접 분기) */
export async function getInstructorCoursesWithRevenue(teacherId: string, brand: string) {
    const brandLower = brand?.toLowerCase() || '';
    let courses: any[] = [];
    let orders: any[] = [];

    // ✅ include 로직 반영 (수강생 수 조회를 위한 enrollments 포함)
    const courseInclude = {
        enrollments: {
            // where: { role: null },
            select: { id: true },
        },
    };

    // ✅ if 문으로 DB 분기 직접 처리
    if (brandLower.includes('ivy')) {
        courses = await ivyDb.course.findMany({
            where: { teachers: { some: { id: teacherId } } },
            include: courseInclude,
            orderBy: { createdAt: 'desc' },
        });

        if (courses.length > 0) {
            orders = await ivyDb.order.findMany({
                where: { orderItems: { some: { courseId: { in: courses.map(c => c.id) } } } },
                include: { orderItems: true, payments: true }
            });
        }
    } else {
        courses = await cojoobooDb.course.findMany({
            where: { teachers: { some: { id: teacherId } } },
            include: courseInclude,
            orderBy: { createdAt: 'desc' },
        });

        if (courses.length > 0) {
            orders = await cojoobooDb.order.findMany({
                where: { orderItems: { some: { courseId: { in: courses.map(c => c.id) } } } },
                include: { orderItems: true, payments: true }
            });
        }
    }

    if (courses.length === 0) return [];

    const revenueMap = new Map<string, number>();
    const refundMap = new Map<string, number>();
    const courseIds = courses.map((c: any) => c.id);

    const paidStatuses = [PaymentStatus.DONE, PaymentStatus.CANCELED, PaymentStatus.PARTIAL_CANCELED];

    for (const order of orders) {
        const paidPayments = dedupePayments(order.payments.filter((p: any) => paidStatuses.includes(p.paymentStatus)));
        
        const allocItems = order.orderItems.map((it: any) => ({
            key: it.courseId || 'other',
            price: (it.discountedPrice ?? it.originalPrice) || 0
        }));

        const allocPaid = allocateByRatio(allocItems, sum(paidPayments.map(p => p.amount)));
        const allocCancel = allocateByRatio(allocItems, sum(paidPayments.map(p => p.cancelAmount)));

        courseIds.forEach(id => {
            revenueMap.set(id, (revenueMap.get(id) ?? 0) + (allocPaid.get(id) || 0));
            refundMap.set(id, (refundMap.get(id) ?? 0) + (allocCancel.get(id) || 0));
        });
    }

    return courses.map((course: any) => ({
        id: course.id,
        title: course.title,
        studentCount: course.enrollments?.length || 0,
        totalRevenue: revenueMap.get(course.id) || 0,
        totalRefund: refundMap.get(course.id) || 0,
        netRevenue: (revenueMap.get(course.id) || 0) - (refundMap.get(course.id) || 0)
    }));
}