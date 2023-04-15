import axios from "axios"

const getQueries = async (
    file: string
): Promise<{ vulnerable: string[][]; corrections: string[][] }> => {
    try {
        const {
            data
        }: { data: { vulnerable: string[][]; corrections: string[][] } } =
            await axios.post("http://172.20.10.2:8080/query", {
                file
            })
        return { vulnerable: data.vulnerable, corrections: data.corrections }
    } catch (e) {
        return { vulnerable: [], corrections: [] }
    }
}

export default getQueries
