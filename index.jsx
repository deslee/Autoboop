import {Helmet} from "react-helmet";
import CatFinder from './components/CatFinder'

export default class extends React.Component {
    static async getInitialProps(){
    }
    render() {
      return <React.Fragment>
          <Helmet>
                <meta charSet="utf-8" />
                <title>AutoBooper</title>
                <style>{`
                * {
                    margin: 0;
                    padding: 0;
                }
                
                .app {
                    overflow: hidden;
                }
                `}</style>
            </Helmet>
          <CatFinder
            margin={50}
            width={600}
            height={500}
            requiredDelay={500}
          />
      </React.Fragment>
    }
  }