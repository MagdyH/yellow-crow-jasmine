import Metrics from './metricEnum';

export const getMetricsPRs = async (dateFrom, dateTo, metricType) => {

    return fetch("https://api.athenian.co/v1/metrics/prs", {
        "body": JSON.stringify({
            "for": metricType === Metrics.prOpened ? [
                {
                    "repositories": ["github.com/athenianco/athenian-api",
                        "github.com/athenianco/athenian-webapp",
                        "github.com/athenianco/infrastructure",
                        "github.com/athenianco/metadata"],
                    "repogroups": [[0], [1], [2], [3]]
                }
            ] : [
                    {
                        "repositories": ["github.com/athenianco/athenian-api",
                            "github.com/athenianco/athenian-webapp",
                            "github.com/athenianco/infrastructure",
                            "github.com/athenianco/metadata"]
                    }
                ],
            "metrics": ["pr-review-time", "pr-opened"],
            "date_from": dateFrom,
            "date_to": dateTo,
            "granularities": ["day"],
            "exclude_inactive": true,
            "account": 1,
            "timezone": 60
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
    });
}

