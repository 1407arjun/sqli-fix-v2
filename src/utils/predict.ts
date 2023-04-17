import axios from "axios"

const predict = async (
    ips: string[],
    attack: string
): Promise<{ prediction: boolean; title: string; description: string }> => {
    try {
        const {
            data: { prediction, title, description }
        }: {
            data: { prediction: boolean; title: string; description: string }
        } = await axios.post(`http://172.20.10.2:8080/${attack}/predict`, {
            ips
        })
        return { prediction, title, description }
    } catch (e) {
        return {
            prediction: true,
            title: "Error",
            description: "Unknown error occured"
        }
    }
}

export default predict
