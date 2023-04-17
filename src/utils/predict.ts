import axios from "axios"

const predict = async (
    variables: string[],
    ips: string[]
): Promise<boolean> => {
    try {
        const { data }: { data: { prediction: boolean } } = await axios.post(
            "http://172.20.10.2:8080/predict",
            {
                variables,
                ips
            }
        )
        return data.prediction
    } catch (e) {
        return false
    }
}

export default predict
