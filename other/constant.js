/**
 * Created by Windows on 15-Jul-17.
 */
exports.pi = '3.14';

exports.CONST = {

    //region OTHERS
    REQUEST_NOTI_TIME_OUT : 'request_notification_time_out',
    REQUEST_TOKEN_REGISTRATION: 'request_token_registration',

    RESPONSE_NOTI_TIME_OUT : 'response_notification_time_out',
    CANCEL_BOOKING_TIMEOUT : 20 * 1000,
    NOTIFY_BOOKING_TIMEOUT : 10 * 1000,
    //endregion

    //region ACCOUNT
    REQUEST_LOGIN_WITH_EMAIL_AND_PASS: 'check_email_and_password',
    REQUEST_CHECK_TOKEN: 'request_check_token',
    REQUEST_CREATE_NEW_ACCOUNT: 'request_create_account',
    REQUEST_RESET_PASSWORD: 'request_reset_password',
    REQUEST_CHANGE_PASSWORD: 'request_change_password',
    REQUEST_GET_SALT: 'request_get_salt',
    RESPONSE_GET_SALT: 'response_get_salt',

    RESPONSE_CHECK_TOKEN: 'response_check_token',
    RESPONSE_COMPARE_CODE: 'response_compare_code',
    RESPONSE_LOGIN_WITH_EMAIL_AND_PASS: 'result_login',
    RESPONSE_CREATE_NEW_ACCOUNT: 'response_create_account',
    RESPONSE_RESET_PASSWORD: 'response_reset_password',
    RESPONSE_CHANGE_PASSWORD: 'response_change_password',

    REQUEST_CREATE_ACCOUNT_SECURITY: 'request_create_new_account_for_security',
    RESPONSE_CREATE_ACCOUNT_SECURITY: 'response_create_new_account_for_security',


    //endregion

    //region GARAGE
    REQUEST_ADD_NEW_GARAGE: 'request_add_new_garage',
    REQUEST_GET_ALL_GARAGES: 'request_all_garages',
    REQUEST_GET_GARAGE_BY_ID: 'request_get_garage_by_id',
    REQUEST_GET_GARAGE_BY_ACCOUNT_ID: 'request_get_garage_by_account_id',
    REQUEST_EDIT_GARAGE_BY_ID: 'request_edit_garage_by_id',
    REQUEST_EDIT_STATUS_GARAGE_BY_ID: 'request_edit_status_garage_by_id',

    RESPONSE_ADD_NEW_GARAGE: 'response_add_new_garage',
    RESPONSE_GET_ALL_GARAGE: 'response_all_garages',
    RESPONSE_GET_GARAGE_BY_ID: 'response_get_garage_by_id',
    RESPONSE_GET_GARAGE_BY_ACCOUNT_ID: 'response_get_garage_by_account_id',
    RESPONSE_EDIT_GARAGE_BY_ID: 'response_edit_garage_by_id',
    RESPONSE_EDIT_STATUS_GARAGE_BY_ID: 'response_edit_status_garage_by_id',
    RESPONSE_GARAGE_UPDATED: 'response_garage_updated',
    //endregion

    //region CAR
    REQUEST_ADD_NEW_CAR: 'request_add_new_car',
    REQUEST_REMOVE_CAR: 'request_remove_car_by_vehicle_number',
    REQUEST_FIND_CAR_BY_ACCOUNT_ID: 'request_find_car_by_account_id',
    REQUEST_FIND_CAR_BY_ID: 'request_find_car_by_id',
    REQUEST_EDIT_VEHICLE_BY_NUMBER: 'request_change_vehicle_by_number',
    REQUEST_REMOVE_CAR_BY_ID: 'request_remove_car_by_id',

    RESPONSE_ADD_NEW_CAR: 'response_add_new_car',
    RESPONSE_REMOVE_CAR: 'response_remove_car_by_vehicle_number',
    RESPONSE_FIND_CAR_BY_ACCOUNT_ID: 'response_find_car_by_account_id',
    RESPONSE_FIND_CAR_BY_ID: 'response_find_car_by_id',
    RESPONSE_EDIT_VEHICLE_BY_NUMBER: 'response_change_vehicle_by_number',
    RESPONSE_REMOVE_CAR_BY_ID: 'response_remove_car_by_id',
    //endregion

    //region USER
    REQUEST_ADD_NEW_USER: 'request_add_new_user',
    REQUEST_ADD_NEW_USER_BY_ACCOUNT_ID: 'request_add_new_user_by_account_id',
    REQUEST_REMOVE_USER_BY_ID: 'request_remove_user_by_id',
    REQUEST_FIND_USER_BY_ID: 'request_find_user_by_id',
    REQUEST_FIND_USER_BY_ACCOUNT_ID: 'request_find_user_by_account_id',
    REQUEST_EDIT_USER_BY_ID: 'request_edit_user_by_id',

    RESPONSE_ADD_NEW_USER: 'response_add_new_user',
    RESPONSE_ADD_NEW_USER_BY_ACCOUNT_ID: 'request_add_new_user_by_account_id',
    RESPONSE_REMOVE_USER_BY_ID: 'response_remove_user_by_id',
    RESPONSE_FIND_USER_BY_ID: 'response_find_user_by_id',
    RESPONSE_FIND_USER_BY_ACCOUNT_ID: 'response_find_user_by_account_id',
    RESPONSE_EDIT_USER_BY_ID: 'response_edit_user_by_id',
    //endregion

    //region BOOKING
    REQUEST_ADD_NEW_BOOKING: 'request_add_new_booking',
    REQUEST_REMOVE_BOOKING_BY_ID: 'request_remove_booking_by_id',
    REQUEST_FIND_BOOKING_BY_ID: 'request_find_booking_by_id',
    REQUEST_FIND_BOOKING_BY_CAR_ID: 'request_find_booking_by_car_id',
    REQUEST_FIND_BOOKING_BY_GARAGE_ID: 'request_find_booking_by_garage_id',
    REQUEST_EDIT_BOOKING_TIME_GO_IN_BY_ID: 'request_edit_booking_time_go_in_by_id',
    REQUEST_EDIT_BOOKING_TIME_GO_OUT_BY_ID: 'request_edit_booking_time_go_out_by_id',
    REQUEST_BOOKING_BY_ACCOUNT_ID: 'request_booking_account_id',

    RESPONSE_ADD_NEW_BOOKING: 'response_add_new_booking',
    RESPONSE_REMOVE_BOOKING_BY_ID: 'response_remove_booking_by_id',
    RESPONSE_FIND_BOOKING_BY_ID: 'response_find_booking_by_id',
    RESPONSE_FIND_BOOKING_BY_CAR_ID: 'response_find_booking_by_car_id',
    RESPONSE_FIND_BOOKING_BY_GARAGE_ID: 'response_find_booking_by_garage_id',
    RESPONSE_EDIT_BOOKING_TIME_GO_IN_BY_ID: 'response_edit_booking_time_go_in_by_id',
    RESPONSE_EDIT_BOOKING_TIME_GO_OUT_BY_ID: 'response_edit_booking_time_go_out_by_id',
    RESPONSE_BOOKING_BY_ACCOUNT_ID: 'response_booking_account_id',
    //endregion

    //region PARKING INFO
    REQUEST_ADD_NEW_PARKING_INFO: 'request_add_new_booking',
    REQUEST_ADD_NEW_PARKING_INFO_BY_USER: 'request_add_new_booking_by_user',
    REQUEST_REMOVE_PARKING_INFO_BY_ID: 'request_remove_booking_by_id',
    REQUEST_FIND_PARKING_INFO_BY_ID: 'request_find_booking_by_id',
    REQUEST_FIND_PARKING_INFO_BY_CAR_ID: 'request_find_booking_by_car_id',
    REQUEST_FIND_PARKING_INFO_BY_GARAGE_ID: 'request_find_booking_by_garage_id',
    REQUEST_EDIT_PARKING_INFO_TIME_GO_IN_BY_ID: 'request_edit_booking_time_go_in_by_id',
    REQUEST_EDIT_PARKING_INFO_TIME_GO_OUT_BY_ID: 'request_edit_booking_time_go_out_by_id',
    REQUEST_PARKING_INFO_HISTORY_BY_ACCOUNT_ID: 'request_booking_history_account_id',
    REQUEST_PARKING_INFO_BY_ACCOUNT_ID: 'request_booking_account_id',
    REQUEST_EDIT_PARKING_INFO_BY_ID_STATUS: 'request_edit_parking_info_id_status',
    REQUEST_REFRESH_BOOKING_TIMEOUT: 'request_refresh_booking_timeout',

    REQUEST_CAR_GO_IN: 'request_car_go_in',
    REQUEST_CAR_GO_OUT: 'request_car_go_out',
    REQUEST_CAR_IN_ID: 'request_one_car_in_by_id',
    REQUEST_CAR_IN_NUMBER: 'request_one_car_in_by_vehicle_number',
    REQUEST_CAR_OUT: 'request_one_car_out',

    RESPONSE_ADD_NEW_PARKING_INFO: 'response_add_new_booking',
    RESPONSE_ADD_NEW_PARKING_INFO_BY_USER: 'response_add_new_booking_by_user',
    RESPONSE_REMOVE_PARKING_INFO_BY_ID: 'response_remove_booking_by_id',
    RESPONSE_FIND_PARKING_INFO_BY_ID: 'response_find_booking_by_id',
    RESPONSE_FIND_PARKING_INFO_BY_CAR_ID: 'response_find_booking_by_car_id',
    RESPONSE_FIND_PARKING_INFO_BY_GARAGE_ID: 'response_find_booking_by_garage_id',
    RESPONSE_EDIT_PARKING_INFO_TIME_GO_IN_BY_ID: 'response_edit_booking_time_go_in_by_id',
    RESPONSE_EDIT_PARKING_INFO_TIME_GO_OUT_BY_ID: 'response_edit_booking_time_go_out_by_id',
    RESPONSE_PARKING_INFO_HISTORY_BY_ACCOUNT_ID: 'response_booking_history_account_id',
    RESPONSE_PARKING_INFO_BY_ACCOUNT_ID: 'response_booking_account_id',
    RESPONSE_EDIT_PARKING_INFO_BY_ID_STATUS: 'response_edit_parking_info_id_status',
    RESPONSE_REFRESH_BOOKING_TIMEOUT: 'response_refresh_booking_timeout',

    RESPONSE_CAR_GO_IN: 'response_car_go_in',
    RESPONSE_CAR_GO_OUT: 'response_car_go_out',
    RESPONSE_CAR_IN: 'response_one_car_in',
    RESPONSE_CAR_OUT: 'response_one_car_out',

    RESPONSE_BOOKING_CANCELED : 'response_booking_canceled',

    //endregion

    //region SECURITY
    REQUEST_ADD_NEW_SECURITY: 'request_add_new_security',
    REQUEST_REMOVE_SECURITY: 'request_remove_security',
    REQUEST_FIND_SECURITY_BY_GARAGE_ID: 'request_find_security_by_garage_id',
    REQUEST_FIND_SECURITY_BY_ACCOUNT_ID: 'request_find_security_by_account_id',
    REQUEST_EDIT_SECURITY_BY_ID: 'request_edit_security_by_id',

    RESPONSE_ADD_NEW_SECURITY: 'response_add_new_security',
    RESPONSE_REMOVE_SECURITY: 'response_remove_security',
    RESPONSE_FIND_SECURITY_BY_GARAGE_ID: 'response_find_security_by_garage_id',
    RESPONSE_FIND_SECURITY_BY_ACCOUNT_ID: 'response_find_security_by_account_id',
    RESPONSE_EDIT_SECURITY_BY_ID: 'response_edit_security_by_id',

    REQUEST_ALL_SECURITY: 'request_all_security',
    RESPONSE_ALL_SECURITY: 'response_all_security',

    RB_GARAGE_STATUS: 'request_find_booking_by_garage_id_and_status',
    //endregion

    //region ROLE
    REQUEST_ADD_NEW_ROLE: 'request_add_new_role',
    REQUEST_FIND_ROLE_BY_ID: 'request_find_role_by_id',
    REQUEST_EDIT_ROLE_BY_ID: 'request_edit_role_by_id',

    RESPONSE_ADD_NEW_ROLE: 'response_add_new_security',
    RESPONSE_FIND_ROLE_BY_ID: 'response_remove_security',
    RESPONSE_FIND_ROLE_BY_GARAGE_ID: 'response_find_role_by_id',
    //endregion
}
