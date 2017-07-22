/**
 * Created by Windows on 22-Jul-17.
 */

exports.errorSQL = function(sql, callback, err) {
    console.error('error running query :' + sql, err);
    callback({'result': false, 'mess': "Query error:"+sql});
};


exports.errorDBConnection = function(error, callback) {
    console.error('error fetching client from pool', error);
    callback({'result': false, 'mess': "Cann`t connect to db"});
};