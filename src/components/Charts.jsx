import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Metrics from '../metricEnum';
import { getMetricsPRs } from '../apiClient';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';

const KPIBox = styled.div`
    border-radius:1.25rem;
    border: 1px solid #ccc!important;
    height: 80px;
    width: 105px;
`;

const KPIBoxHeader = styled.h6`
    background-color: rgb(61, 145, 255);
    color: white;
    border-radius:1.25rem 1.25rem 0 0;
`;

const KPIBoxBody = styled.span`
    color:#666666;
    font-weight: ${props => props.metricType === Metrics.prReviewTime ? "700" : "400"};
`;

export default function ChartsWrapper(props) {
    const [chartData, setChartData] = useState([]);
    const [avgMetrics, setAvgMetrics] = useState(0);

    const highChartsRef = useRef();
    let seriesData = [];
    let avgReviewTime = 0;
    let avgPRsPerRepo = 0;
    let sumOfReviewTime = 0;
    let sumOfPRs = 0;

    const getReviewTimeMetric = (data) => {
        data[0].forEach(item => {
            let date = new Date(item.date);
            let prReviewTimeMetric = item.reviewTime ? Math.round(parseInt(item.reviewTime?.replace('s', '')) / 3600) : 0;

            if (new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString() === date.toLocaleDateString()) {
                seriesData.push([date.getTime(),
                    prReviewTimeMetric]);
            }

            sumOfReviewTime += prReviewTimeMetric;
        });

        avgReviewTime = sumOfReviewTime / data[0].length;
        setAvgMetrics(avgReviewTime);
        setChartData(seriesData);
    }

    const getPROpenMetric = (data) => {
        data.forEach(item => {
            let prOpenMetric = item.opened ? item.opened : 0;
            let sumOfOpenedPRs = prOpenMetric.reduce((sum, val) => {
                return sum + val;
            }, 0);
            seriesData.push([item.repositoryName,
                sumOfOpenedPRs]);

            sumOfPRs += sumOfOpenedPRs;
        });

        avgPRsPerRepo = sumOfPRs / seriesData.length;
        setAvgMetrics(avgPRsPerRepo);
        setChartData(seriesData);
    }

    const normalizeReviewTimeMetircData = (calculatedData) => {
        let seriesData = calculatedData.map(repo => (
            repo.values.map(val => {
                return (
                    {
                        date: val.date,
                        reviewTime: val.values[0]
                    }
                )
            })
        ));

        getReviewTimeMetric(seriesData);
    }


    const normalizeOpenedPRMetricData = (calculatedData) => {
        let seriesData = calculatedData.map(repo => {
            let name = repo.for.repositories[0];
            let values = repo.values.map(val => {
                return (
                    val.values[1]
                )
            })
            return { repositoryName: name, opened: values }
        });

        getPROpenMetric(seriesData);
    }

    useEffect(() => {
        let dateRange = props.dateRange;
        if (dateRange && dateRange.length > 0 && props.metricType !== '') {
            async function getMetrics() {
                await getMetricsPRs(dateRange[0], dateRange[1], props.metricType).then(data => {
                    return data.json();
                }).then((data) => {
                    if (props.metricType === Metrics.prReviewTime) {
                        normalizeReviewTimeMetircData(data.calculated);
                    }
                    else {
                        normalizeOpenedPRMetricData(data.calculated);
                    }
                })
            }
            setChartData([]);
            setAvgMetrics(0);
            getMetrics();
        }
    }, [props.dateRange, props.metricType]);

    const options = props.metricType === Metrics.prReviewTime ? {
        title: {
            text: 'Review Time chart'
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%d}',
            }
        },
        yAxis: {
            title: {
                text: 'Review time in hours',
                align: "high"
            }
        },
        series: [{
            type: 'line',
            data: chartData
        }]
    } : {
            title: {
                text: 'Opened PRs chart'
            },
            yAxis: {
                title: {
                    text: 'PRs Created',
                    align: "high"
                }
            },
            xAxis: [{
                categories: chartData.map(item => (item[0]))
            }],
            series: [{
                type: 'column',
                data: chartData.map(item => (item[1]))
            }]
        }

    return (
        <div className="row">
            {chartData.length === 0 ?
                <div className={'spinner'}><Loader
                    type="Puff"
                    color="#7cb5ec"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                /> </div> : <>
                    <div className="col-10">
                        <HighchartsReact highcharts={Highcharts} options={options} ref={highChartsRef}>
                        </HighchartsReact>
                    </div>

                    <div className="col-2">
                        <KPIBox>
                            <KPIBoxHeader>Average</KPIBoxHeader>
                            <KPIBoxBody>
                                {Math.round(avgMetrics)} {props.metricType === Metrics.prReviewTime ? "hours" : "PRs/Repo"}
                            </KPIBoxBody>
                        </KPIBox>
                    </div>
                </>}
        </div>
    )
}