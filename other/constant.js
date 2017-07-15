/**
 * Created by Windows on 15-Jul-17.
 */
exports.pi = '3.14';

exports.CONST = {

    //region ACCOUNT
    REQUEST_LOGIN_WITH_EMAIL_AND_PASS : 'check_email_and_password',
    REQUEST_CREATE_NEW_ACCOUNT: 'request_create_account',
    REQUEST_RESET_PASSWORD: 'request_reset_password',
    REQUEST_CHANGE_PASSWORD: 'request_change_password',

    RESPONSE_LOGIN_WITH_EMAIL_AND_PASS :'result_login',
    RESPONSE_CREATE_NEW_ACCOUNT : 'response_create_account',
    RESPONSE_RESET_PASSWORD: 'response_reset_password',
    RESPONSE_CHANGE_PASSWORD: 'response_change_password',
    //endregion

    //region GARAGE
    REQUEST_GET_ALL_GARAGES: 'request_all_garages',

    RESPONSE_GET_ALL_GARAGE: 'response_all_garages',
    //endregion

    //region CAR
    REQUEST_ADD_NEW_CAR : 'request_add_new_car',
    REQUEST_REMOVE_CAR: 'request_remove_car_by_vehicle_number',
    REQUEST_FIND_CAR_BY_ACCOUNT_ID: 'request_find_car_by_account_id',
    REQUEST_EDIT_VEHICLE_BY_NUMBER: 'request_change_vehicle_by_number',

    RESPONSE_ADD_NEW_CAR : 'response_add_new_car',
    RESPONSE_REMOVE_CAR: 'response_remove_car_by_vehicle_number',
    RESPONSE_FIND_CAR_BY_ACCOUNT_ID: 'response_find_car_by_account_id',
    RESPONSE_EDIT_VEHICLE_BY_NUMBER: 'response_change_vehicle_by_number',
    //endregion

    //region USER
    REQUEST_ADD_NEW_USER : 'request_add_new_user',
    REQUEST_REMOVE_USER_BY_ID: 'request_remove_user_by_id',
    REQUEST_FIND_USER_BY_ID: 'request_find_user_by_id',
    REQUEST_EDIT_USER_BY_ID: 'request_edit_user_by_id',

    RESPONSE_ADD_NEW_USER : 'response_add_new_user',
    RESPONSE_REMOVE_USER_BY_ID: 'response_remove_user_by_id',
    RESPONSE_FIND_USER_BY_ID: 'response_find_user_by_id',
    RESPONSE_EDIT_USER_BY_ID: 'response_edit_user_by_id',
    //endregion

    //region BOOKING
    REQUEST_ADD_NEW_BOOKING : 'request_add_new_booking',
    REQUEST_REMOVE_BOOKING_BY_ID: 'request_remove_booking_by_id',
    REQUEST_FIND_BOOKING_BY_ID: 'request_find_booking_by_id',
    REQUEST_FIND_BOOKING_BY_CAR_ID: 'request_find_booking_by_car_id',
    REQUEST_FIND_BOOKING_BY_GARAGE_ID: 'request_find_booking_by_garage_id',
    REQUEST_EDIT_BOOKING_TIME_GO_IN_BY_ID: 'request_edit_booking_time_go_in_by_id',
    REQUEST_EDIT_BOOKING_TIME_GO_OUT_BY_ID: 'request_edit_booking_time_go_out_by_id',

    RESPONSE_ADD_NEW_BOOKING : 'response_add_new_booking',
    RESPONSE_REMOVE_BOOKING_BY_ID: 'response_remove_booking_by_id',
    RESPONSE_FIND_BOOKING_BY_ID: 'response_find_booking_by_id',
    RESPONSE_FIND_BOOKING_BY_CAR_ID: 'response_find_booking_by_car_id',
    RESPONSE_FIND_BOOKING_BY_GARAGE_ID: 'response_find_booking_by_garage_id',
    RESPONSE_EDIT_BOOKING_TIME_GO_IN_BY_ID: 'response_edit_booking_time_go_in_by_id',
    RESPONSE_EDIT_BOOKING_TIME_GO_OUT_BY_ID: 'response_edit_booking_time_go_out_by_id',
    //endregion

    //region SECURITY
    REQUEST_ADD_NEW_SECURITY : 'request_add_new_security',
    REQUEST_REMOVE_SECURITY: 'request_remove_security',
    REQUEST_FIND_SECURITY_BY_GARAGE_ID: 'request_find_security_by_garage_id',
    REQUEST_FIND_SECURITY_BY_ACCOUNT_ID: 'request_edit_security_by_account_id',
    REQUEST_EDIT_SECURITY_BY_ID: 'request_edit_security_by_id',

    RESPONSE_ADD_NEW_SECURITY : 'response_add_new_security',
    RESPONSE_REMOVE_SECURITY: 'response_remove_security',
    RESPONSE_FIND_SECURITY_BY_GARAGE_ID: 'response_find_security_by_garage_id',
    RESPONSE_FIND_SECURITY_BY_ACCOUNT_ID: 'response_edit_security_by_account_id',
    RESPONSE_EDIT_SECURITY_BY_ID: 'response_edit_security_by_id',
    //endregion

    //region ROLE

    //endregion
}