import React, { useState } from 'react';
import ChartsWrapper from './Charts';
import Metrics from '../metricEnum';

export default function TabManager(props) {
    const [showTabs, setShowTabs] = useState(false);
    const [metricType, setMetricType] = useState('');


    return (
        <>
            <div className={'container'}>
                <ul className="nav nav-tabs nav-justified" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link aDisabled" data-toggle="tab" onClick={() => { setShowTabs(true); setMetricType(Metrics.prReviewTime) }} href="#tab1">Review Time Metric</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link aDisabled" data-toggle="tab" onClick={() => { setShowTabs(true); setMetricType(Metrics.prOpened) }} href="#tab2">Opened Metric</a>
                    </li>
                </ul>

                <div className="tab-content">
                    {
                        showTabs && <ChartsWrapper dateRange={props.dateRange} metricType={metricType} />
                    }
                </div>
            </div>
        </>

    );
}