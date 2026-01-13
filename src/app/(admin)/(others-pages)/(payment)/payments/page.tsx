import React from 'react';
import { getSession } from '@/lib/session';
import { Card } from '@/components/ui/card';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';


import { columns } from './_components/columns';
import { getInstructorCoursesWithRevenue } from './actions';
import { PaymentDataTable } from './_components/PaymentDataTable';

export default async function InstructorLecturePaymentsPage({ searchParams }: any) {   
    const session = await getSession();
    
    // 권한 체크
    if (!session || !session.tId) {
        return <div className="p-6 text-red-500 font-bold">로그인이 필요한 페이지입니다.</div>;
    }

    const teacherId = session.tId;
    const brand = session.brand;

    if (!brand) {
        return <div className="p-6 text-gray-500">브랜드 정보가 없습니다.</div>;
    }

    const { from, to, status, search } = await searchParams;
    const dateRange = from && to ? { from: new Date(from), to: new Date(to) } : undefined;

    // 데이터 호출
    const data = await getInstructorCoursesWithRevenue(teacherId, brand);

    return (
        <div className="space-y-6 p-6">
            <PageBreadcrumb 
                pageTitle="강의별 매출 현황" 
                items={[{ label: "홈", href: "/" }, { label: "매출 관리" }]} 
            />

            <h1 className="text-2xl font-bold">강의별 매출 현황</h1>

            <Card className="p-6 border-none shadow-sm bg-white dark:bg-gray-800">
                <div className="mb-4">
                    <h3 className="text-lg font-bold">강의 리스트</h3>
                </div>
                
                {/* ✅ 수정된 컬럼 적용 */}
                <PaymentDataTable
                    columns={columns}
                    data={data}
                    searchKey="title"
                    searchPlaceholder="강의명을 검색해보세요."
                />
            </Card>
        </div>
    );
}