import React, { useState } from 'react';
import DateRange from '../components/DateRange'
import TabManager from '../components/TabManager';

export default function ReportPage(props) {
    const [dateRangeState, setDateRangeState] = useState([]);

    const handleFilterByDate = (dateFrom, dateTo) => {
        setDateRangeState([dateFrom,dateTo]);
    }

    return (
        <div className={'container'}>
            <DateRange handleFilterByDate={handleFilterByDate} />
            <TabManager dateRange={dateRangeState} />
        </div>
    );
}