import apiSlice from "./api";


export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    createdAt: string;
    edited?: boolean;
    deleted?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export const messageApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Get messages between two users
        getMessage: builder.query<
        Message[],
        { senderId: string; receiverId: string }
        >({
            query: ({ senderId, receiverId }) => ({
                url: `/api/messages/${senderId}/${receiverId}`,
                method: "GET",
            }),
        }),

        //Edit Message
        editMessage: builder.mutation<
            any,
            { id: string; message: string }
        >({
            query: ({ id, message }) => ({
                url: `/api/messages/edit/${id}`,
                method: "PUT",
                body: { message },
            }),
        }),

        //Delete Message
        deleteMessage: builder.mutation<
            any,
            string
        >({
            query: (id) => ({
                url: `/api/messages/delete/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useGetMessageQuery, useEditMessageMutation, useDeleteMessageMutation } = messageApis;