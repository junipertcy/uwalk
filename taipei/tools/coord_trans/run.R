# run.R
# This script transforms CRS from TWD97 to WGS84
#
#
#
# Tzu-Chi Yen <junipertcy@gmail.com>
# May 21, 2015
#
y = read.csv('location_97.csv');
x = data.matrix(y);

source('~/Workspace/R/twcoor.trans.R', chdir = TRUE)
x_84 = twcoor.trans(x, 97, 84);

write.csv(x_84, 'new.csv', row.names = FALSE)

