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
        } = await axios.post(
            `${process.env.NEXT_PUBLIC_FLASK_SERVER}/${attack}/predict`,
            {
                ips
            }
        )
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
