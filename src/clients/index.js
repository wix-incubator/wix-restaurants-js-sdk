import { default as WixRestaurantsClient, Endpoints } from './WixRestaurantsClient';
import { default as WixRestaurantsAnalyticsClient, BaseUrls as AnalyticsBaseUrls, Metrics, Periods, Platforms, Statuses } from './WixRestaurantsAnalyticsClient';
import { createRestClient } from './RestClient';

export {
    WixRestaurantsClient, Endpoints,
    WixRestaurantsAnalyticsClient, AnalyticsBaseUrls, Metrics, Periods, Platforms, Statuses,
    createRestClient
};
