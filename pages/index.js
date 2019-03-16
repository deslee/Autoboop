import { Helmet } from "react-helmet";
import CatFinder from '../components/CatFinder'

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
                margin={50}
                width={600}
                height={500}
                requiredDelay={500}
            />
        </React.Fragment>
    }
}