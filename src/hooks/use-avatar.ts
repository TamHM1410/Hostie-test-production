import { useMemo } from 'react'


export const useDefaultAvatar=()=> {
    const defaultAvatar :any=useMemo(()=>'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg',[])

    return {
        defaultAvatar
    }
}


