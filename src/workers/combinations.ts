import BackgroundWorker from "@/bll/backgroundWorker"
import CombinationFinder from "@/bll/combinationFinder";
import LatheConfig from "@/bll/latheConfig";


export default {}

const bw = new BackgroundWorker();
const cf = new CombinationFinder((b, p) => bw.reportProgress(p), true);

bw.initWorker(async (param: any) => {
    const config = LatheConfig.fromPlainObject(param);

    return cf.findAllCombinations(config);
});
