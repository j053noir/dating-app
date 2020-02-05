import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { Message } from '../_models/message';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    baseUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) {}

    getUsers(
        page?: number,
        itemsPerPage?: number,
        userParams?: any,
        likesParams?: any
    ): Observable<PaginatedResult<User[]>> {
        const paginatedResult = new PaginatedResult<User[]>();

        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', `${page}`);
            params = params.append('pageSize', `${itemsPerPage}`);
        }

        if (userParams != null) {
            if (userParams.applyFilters) {
                params = params.append('minAge', userParams.minAge);
                params = params.append('maxAge', userParams.maxAge);
                params = params.append('gender', userParams.gender);
            }

            if (userParams.orderBy && userParams.orderDirection) {
                params = params.append('orderBy', userParams.orderBy);
                params = params.append(
                    'orderDirection',
                    userParams.orderDirection
                );
            }
        }

        if (likesParams != null) {
            if (likesParams === 'likers') {
                params = params.append('likers', 'true');
            } else if (likesParams === 'likees') {
                params = params.append('likees', 'true');
            }
        }

        return this.http
            .get(this.baseUrl, { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body as User[];
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get('Pagination')
                        );
                    }
                    return paginatedResult;
                })
            );
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(
            `${this.baseUrl}/${userId}/photos/${id}/setMain`,
            {}
        );
    }

    updateUser(id: number, user: User) {
        return this.http.put(`${this.baseUrl}/${id}`, user);
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${userId}/photos/${id}`);
    }

    sendLike(userId: number, likeeId: number) {
        return this.http.post(`${this.baseUrl}/${userId}/like/${likeeId}`, {});
    }

    getMessages(
        userId: number,
        page?: number,
        itemsPerPage?: number,
        messageContainer?: any
    ) {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
            Message[]
        >();

        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', `${page}`);
            params = params.append('pageSize', `${itemsPerPage}`);
        }

        if (messageContainer != null) {
            params = params.append('messageContainer', messageContainer);
        }

        return this.http
            .get<Message[]>(`${this.baseUrl}/${userId}/messages`, {
                observe: 'response',
                params,
            })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;

                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get('Pagination')
                        );
                    }

                    return paginatedResult;
                })
            );
    }

    getMessageThread(userId: number, recipientId: number) {
        return this.http.get<Message[]>(
            `${this.baseUrl}/${userId}/messages/threads/${recipientId}`
        );
    }

    sendMessage(userId: number, body: any) {
        return this.http.post(`${this.baseUrl}/${userId}/messages`, body);
    }

    deleteMessage(userId: number, id: number) {
        return this.http.delete(`${this.baseUrl}/${userId}/messages/${id}`);
    }

    markAsRead(userId: number, id: number) {
        return this.http.delete(
            `${this.baseUrl}/${userId}/messages/${id}/read`
        );
    }
}
