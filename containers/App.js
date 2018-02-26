import React, {Component} from 'react';

function Row(props) {
    console.log(props);
    if(props.companies.length){
        return props.companies.map(function(company, index){
            return (
                <li className="company" key={ index }>
                    <h3>{ company.name }</h3>
                    <Product products={ company.products } range={ props.range } />
                </li>
            )
        });
    } else {
        return <div class="loading spinner">Loading</div>
    }
};

function Product(props) {
    const products = props.products.map(function(productRecord, index){

        var randomColor =  Math.floor(Math.random()*256) +", "+  Math.floor(Math.random()*256) +", "+  Math.floor(Math.random()*256);
        var styles = {
            backgroundColor: "rgb("+ randomColor +")",
            outline: "1px solid rgba("+ randomColor +", .5)"
        };
        let product = (
            <li className="product" key={ index } style={ styles }>
                <div className="productName">
                    <a href={ productRecord.url }>
                        { productRecord.name }
                    </a>
                </div>
                <div className="activeStatus">{ String(productRecord.active) }</div>
                <div className="sales">${ String(productRecord.sales).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") }</div>
            </li>
        );

        console.log(props.range);
        console.log(productRecord.sales);
        if(props.range.rangeSelected && props.range.selectedRange > productRecord.sales){
            return product;
        } else if(!props.range.rangeSelected) {
            return product;
        }
    });

    return (
        <ul className="products">
            { products }
        </ul>
    )
};

export default class App extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            companies: [],
            range: {
                min: 0,
                max: 0,
                active: false,
                rangeSelected: false,
                selectedRange: 0
            }
        };

        this.rangeUpdate = this.rangeUpdate.bind(this);
    }
    
    componentDidMount() {
        fetch(`https://wt-0f5f4c2bc1fad8dd9864b1fa2568a69d-0.run.webtask.io/r4-ui-challenge`).then(res => {
            
            res.json().then(resJSON => {
                let min, max = 0;
                let companies = [];

                resJSON.company.forEach(function(company){
                    companies.push({name: company.name, products: []});
                    company.records.forEach(function(record){
                        record.products.records.forEach(function(product){
                            if(companies.length){
                                companies[companies.length - 1].products.push(product);
                            }

                            if(min && min > product.sales){
                                min = product.sales
                            } else {
                                min = product.sales;
                            }

                            if(max < product.sales){
                                max = product.sales;
                            }
                        });
                    });
                });

                console.log(companies);

                this.setState({companies: companies, range: {active: true, min: min, max: max, selectedRange: max} });
                
            });

        });
    }

    rangeUpdate(e) {
        console.log(e);
        console.log(e.currentTarget.value);
        this.setState({range: {
                min: this.state.range.min,
                max: this.state.range.max,
                active: this.state.range.active,
                rangeSelected: true,
                selectedRange: e.currentTarget.value
            }
        });
    }
    
    render() {
        let range = null;
        if(this.state.range.active){
            range = (
                <div>
                    Range ${ String(this.state.range.min).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") } - ${ String(this.state.range.max).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") }<br/>
                    Currently set to: ${ String(this.state.range.selectedRange).replace(/(\d)(?=(\d{3})+(?!\d))/g, "1,") }
                    <input type="range" value={ this.state.range.selectedRange } min={ this.state.range.min } max={ this.state.range.max } onChange={ (e) => { this.rangeUpdate(e) } } />
                </div>
            )
        }

        return (
            <div>
                <h1>Companies</h1>
                { range }
                <ul className="companies">
                    <Row companies={ this.state.companies } range={ this.state.range }/>
                </ul>
            </div>
        )
    }
}