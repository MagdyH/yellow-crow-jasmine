import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import moment from 'moment';

export default function DateRangeWrapper(props) {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const handleOnChange = (ranges) => {
        console.log(ranges);
        setState([ranges.selection]);
        let dateFrom = moment(ranges.selection.startDate).format('yyyy-M-DD');
        let dateTo = moment(ranges.selection.endDate).format('yyyy-M-DD');
        props.handleFilterByDate(dateFrom,dateTo);
    }

    useEffect(()=>{
        let dateFrom = moment(state.startDate).format('yyyy-M-DD');
        let dateTo = moment(state.endDate).format('yyyy-M-DD');
        props.handleFilterByDate(dateFrom,dateTo);
    },[])

    return (
        <>
            <DateRange
                editableDateInputs={true}
                onChange={item => handleOnChange(item) }
                moveRangeOnFirstSelection={false}
                ranges={state}
            />
        </>
    );
}