export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dark: false
        };

        this.changeTheme = this.changeTheme.bind(this);
    }

    changeTheme() {
        this.setState({ dark: !this.state.dark });
    }
    render() {
        return (
            <div>
                <div className={'theme ' + (this.state.dark ? 'theme--dark' : 'theme--default')}>
                    <div className='base'>
                        <div className={'base__page'}>
                            <Router onUpdate={() => window.scrollTo(0, 0)}></Router>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

