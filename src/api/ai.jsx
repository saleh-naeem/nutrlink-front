//creat chat
export async function createChat(info) {
        const token = localStorage.getItem("authToken");

    try {
        const isFormData = info instanceof FormData;

        const res = await fetch(
            "http://localhost:5000/nutrlink/api/AI/chat",
            {
                method: "POST",
                headers: isFormData
                    ? undefined
                    : { "Content-Type": "application/json" ,
                         "Authorization": `Bearer ${token}`
                    },
                body: isFormData
                    ? info
                    : JSON.stringify({  
                        title:info.title
                    }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
//creat message
export async function createmessage(info,chat_id) {
        const token = localStorage.getItem("authToken");

    try {
        const isFormData = info instanceof FormData;

        const res = await fetch(
            `http://localhost:5000/nutrlink/api/AI/${chat_id}`,
            {
                method: "POST",
                headers: isFormData
                    ? undefined
                    : { "Content-Type": "application/json" ,
                         "Authorization": `Bearer ${token}`
                    },
                body: isFormData
                    ? info
                    : JSON.stringify({  
                        message:info.message
                       
                    }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
//get all chat
export async function getchat() {
        const token = localStorage.getItem("authToken");

    try {

        const res = await fetch(
            "http://localhost:5000/nutrlink/api/AI/chat",
            {
                headers: 
                     {
                         "Authorization": `Bearer ${token}`
                     }
            
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
//get messages
export async function getmessages(chat_id) {
        const token = localStorage.getItem("authToken");

    try {

        const res = await fetch(
            `http://localhost:5000/nutrlink/api/AI/messages/${chat_id}`,
            {
                headers: { 
                         "Authorization": `Bearer ${token}`
                         },
               
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
//delete chat
export async function deletechat(chat_id) {
        const token = localStorage.getItem("authToken");

    try {

        const res = await fetch(
           `http://localhost:5000/nutrlink/api/AI/chat/${chat_id}`,
            {
                method: "DELETE",
                headers:  { 
                         "Authorization": `Bearer ${token}`
                          },
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "failed");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}