import axios from "axios"

const predict = async (
    query: string,
    variables: string[],
    ips: string[]
): Promise<boolean> => {
    try {
        const { data }: { data: { prediction: boolean } } = await axios.post(
            "http://172.20.10.2:8080/predict",
            {
                query,
                variables,
                ips
            }
        )
        console.log(data)
        return data.prediction
    } catch (e) {
        console.log(e)
        return false
    }
}

export default predict
