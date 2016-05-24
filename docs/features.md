#Features

For the Foursquare features, the feature vector f(v) of each venue v ∈ V including 30 features, which are,

1. the total number of check-ins at v
2. the number of unique users
3. entropy of the check-in distribution
4. number of likes
5. number of visits/check-ins split down by day (weekday/Saturday/Sunday) and time of day (4-hour-window division).
6. the features involving the surrounding were computed from all others venues, weighted by a 2D Gaussian of arbitrary radius r = 350 meters.

To make our data more reliable, we only consider venues with at least five check-ins by two different users.

For the Airbnb features, we defined a feature vector f(v) of each venue v ∈ V including ?? features, which are,

1. Number of Airbnb reviews per month
2. Number of Airbnb properties per km^2
3. Average renting price per day
4. property type

 **Note:** Airbnb rooms tend to be offered in areas with highly-educated non-UK born renters, while homes tend to be offered in areas with owners of high-end homes in terms of house price.
5. room type