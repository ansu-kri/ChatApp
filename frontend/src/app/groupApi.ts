import apiSlice from "./api";

export interface UploadImageResponse {
    imageUrl: string;
}

export interface UploadAudioResponse {
    audioUrl: string;
}

export interface UploadVideoResponse {
    videoUrl: string;
}

export interface CreateGroupRequest {
    name: string;
    members: string[];
    groupImage?: string;
}

export interface CreateGroupResponse {
    groupId: string;
}

export interface Group {
    id: string;
    name: string;
    members: string[],
    groupImage: string;
}

export const groupApis = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Upload image
        uploadImage: builder.mutation<UploadImageResponse, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/image",
                    method: "POST",
                    body: formData,
                };
            },
        }),

        //Upload Audio
        uploadAudio: builder.mutation<UploadAudioResponse, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/audio",
                    method: "POST",
                    body: formData,
                };
            },
        }),

        //Upload video
        uploadVideo: builder.mutation<UploadVideoResponse, File>({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/video",
                    method: "POST",
                    body: formData,
                };
            },
        }),

        // create group
        createGroup: builder.mutation<CreateGroupResponse, CreateGroupRequest>({
            query: ({ name, members, groupImage }) => ({
                url: `/api/group/create`,
                method: "POST",
                body: {
                    name,
                    members,
                    groupImage,
                },
            }),
            invalidatesTags: ["Groups"],
        }),
        
        //get group members
        getGroups: builder.query<Group[], string>({
            query: (userId) => ({
                url: `/api/group/${userId}`,
                method: "GET",
            }),
            providesTags: ["Groups"],
        }),
    }),
});

export const {
    useUploadImageMutation,
    useUploadAudioMutation,
    useUploadVideoMutation,
    useCreateGroupMutation,
    useGetGroupsQuery,
} = groupApis;