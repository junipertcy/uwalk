require('../env');
var async = require('async');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var clientName = argv.clientName;
var output = argv.output;
var startTime = argv.startTime;
var endTime = argv.endTime;
var _page = argv.page  || 0;
var _count = argv.count || 10;

if (!clientName || !output) {
  console.log('Missing `--clientName` `--output`');
  process.exit();
}

function purifyCSV(value) {
  if (!value) return;
  if (typeof value !== 'string') value = value.toString();
  var quoted = value.indexOf('"') >= 0 || value.indexOf(',') >= 0;
  var result = value.replace(/\"/g, '""');

  if (quoted) {
    result = '"' + result + '"';
  }

  return result;
}

function findAndReturnCSV(client, count, page, callback) {
  console.log('Count :: '+ count + ' , page :: ' + page);
  var queryLog = CardLog.find({
    clients: client._id,
    mail: {
      $exists: true
    }
  });

  if (startTime && endTime) {
    queryLog.and({
      updatedTime: {
        $gte: startTime,
        $lte: endTime
      }
    });
  }

  if (count && page){
    queryLog.skip(count * (page -1));
    queryLog.limit(count);
  } else {
    queryLog.skip(0);
    queryLog.limit(count);
  }


  queryLog.sort('updatedTime').populate('lotteryStores').exec(function(err, logs) {
    if (err) {
      console.log(err);
      process.exit();
    }

    var csv = '';
    async.eachSeries(logs, function(log, next) {
      var item = [];
      var time =  moment(new Date(log.updatedTime).getTime()).format('YYYY-MM-DD HH:mm:ss');
      //item.push(log._id, log.clientName, event.id, log.spotId, log.ticketId, log.activityId, log.openId, time);
      item.push(log.mail, time, log.lotteryStores.name);
      csv += item.map(purifyCSV).join(',') + '\r\n';
      console.log(item);
      next();
    }, function(err) {
      if (err) {
        return callback(err);
      }

      fs.appendFileSync(argv.output, csv, 'utf-8');
      console.log('appendFileSync success.');
      callback(null, logs.length);
    });
  });
}

var amount = 0;
Client.findOne({
  name: clientName
}, function(err, client) {
  if (!client) {
    console.error('Client ' + clientName + ' not found.');
    return process.exit(1);
  }

  async.doUntil(function(next) {
    findAndReturnCSV(client, _count, _page, function(err, _amount) {
      if (err) {
        return next(err);
      }

      amount = _amount;
      _page++;
      next();
    });
  }, function() {
    return amount !== _count;
  }, function(err) {
    if (err) {
      console.log(err);
      process.exists(1);
    }

    console.log('ok.');
    process.exit();
  });
});