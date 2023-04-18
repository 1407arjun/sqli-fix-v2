import axios from "axios"

const identify = async (
    line: string,
    attack: string
): Promise<{ msg: string | null; vars: string[]; correction: string[] }> => {
    try {
        const {
            data: { msg, vars, correction }
        }: { data: { msg: string; vars: string[]; correction: string[] } } =
            await axios.post(`http://172.17.47.236:8080/${attack}/identify`, {
                line
            })
        return { msg, vars, correction }
    } catch (e) {
        return { msg: "Unknown error occured", vars: [], correction: [] }
    }
}

export default identify
