import { useState, useEffect ,useMemo} from "react";
import { getSuggestionChat,getChatSuggest } from "src/api/suggest-chat";
import { useQuery } from "@tanstack/react-query";

const SuggestionChatView = ({ messageRef }: any) => {
    const [suggestList, setSuggestList] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const  {data,isLoading,isLoadingError}=useQuery({
        queryKey:['suggestList'],
        queryFn:async()=>{
            const res =await getChatSuggest()
            // setSuggestList(res)

            return res
        }
    })
   if(isLoading){
    return <>....loading</>
   }
   if(isLoadingError){
    return <>....error</>

   }
    return (
        <>
            {suggestList && suggestList.length > 0 ? (
                suggestList.map((item: any, index: number) => (
                    <div key={index}>{item}</div>
                ))
            ) : (
                <div>Không có gợi ý.</div>
            )}
        </>
    );
};

export default SuggestionChatView;
