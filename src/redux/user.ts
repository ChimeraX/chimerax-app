import { Action } from 'redux';
import User from '@chimerax/common-web/lib/model/User';
import * as endpoints from '../rest/endpoints';
import restClient from '../rest/restClient';
import { AxiosResponse } from 'axios';
import { getCookies } from '@chimerax/common-web/lib/util/cookies';

export interface UserAction extends Action {
    user?: User;
    authenticated?: boolean;
}

export interface UserState {
    user?: User;
    authenticated?: boolean;
}

const token = getCookies().token;

const initial: UserState = {
    authenticated: token !== undefined,
};

const SET_USER = 'SET_USER';
export const setUser = (user: User) => ({
    type: SET_USER,
    user,
});

const SET_AUTH = 'SET_AUTH';
export const setAuthenticated = (authenticated: boolean) => ({
    type: SET_AUTH,
    authenticated,
});

export const fetchUserInfo = () => {
    return (dispatch: any) => {
        return restClient.get(endpoints.userInfoURL)
            .then((response: AxiosResponse<User>) => {
                dispatch(setUser(response.data));
            });
    };
};

export const isAuthenticated = () => {
    return (dispatch: any) => {
        return restClient.get(endpoints.isAuthenticatedURL)
            .then((response: any) => {
                if (response.status === 200) {
                    dispatch(setAuthenticated(true));
                }
            });
    };
};

const user = (state: UserState = initial, action: UserAction) => {
    switch (action.type) {
        case SET_AUTH:
            return { ...state, authenticated: action.authenticated };
        case SET_USER:
            return { ...state, user: action.user };
        default:
            return state;
    }
};

export default user;
