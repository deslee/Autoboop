import { Helmet } from "react-helmet";
import CatFinder from '../components/CatFinder/CatFinder'

export default class extends React.Component {
    render() {
        return <React.Fragment>
            <Helmet>
                <meta charSet="utf-8" />
                <title>AutoBooper</title>
            </Helmet>
            <style global jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <CatFinder
                requiredDelay={200}
            />
        </React.Fragment>
    }
}