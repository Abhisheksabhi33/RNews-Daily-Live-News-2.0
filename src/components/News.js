import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

export default class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: '8',
        category: 'general'

    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props) {
        super(props)

        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults:0

        }

        document.title = `${this.capitalizeFirstLetter(this.props.category)} - RNews`;
    }

    async updateNews() {

        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f2e7c2c36e8b4c408dfbe3dd5ee90cf2&page=${this.state.page}&pageSize=${this.props.pageSize}`;

        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json()

        // console.log(parsedData);

        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false,

        })

    }

    async componentDidMount() {

        this.updateNews();

    }

    fetchMoreData = async() => {
        
        this.setState({page:this.state.page+1})
           
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=f2e7c2c36e8b4c408dfbe3dd5ee90cf2&page=${this.state.page}&pageSize=${this.props.pageSize}`;

        this.setState({ loading: true })
        let data = await fetch(url);
        let parsedData = await data.json()

        // console.log(parsedData);

        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            loading : false

        })

      };


    render() {
        return (
            <>
                <h1 className="text-center" style={{ margin: '10px , 0px' }}>RNews - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && <Spinner />}

                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={this.state.loading && <Spinner />}
                >

               <div className="container">

                    <div className="row">
                        {this.state.articles.map((element) => {

                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>

                        })}
                </div>
                </div>
                </InfiniteScroll>

            </>
        )
    }
}
