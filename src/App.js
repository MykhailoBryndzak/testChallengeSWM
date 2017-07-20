import React, {Component} from 'react';

import {postsRes} from './store/posts'
import {usersRes} from './store/users'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.mergeUserPost(usersRes, postsRes),
            users: usersRes,
            cityList: this.getAllCityForSelector(usersRes),
            companyList: this.getAllCompanyForSelector(usersRes)
        }
    }

    mergeUserPost(usersRes, postsRes) {
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        let resPosts = [];
        usersRes.forEach((u) => {
            postsRes.forEach((p) => {
                if (+u.id === +p.userId) {
                    p.authorName = u.name;
                    p.companyName = u.company.name;
                    p.cityName = u.address.city;
                    p.title = capitalizeFirstLetter(p.title);
                    p.body = capitalizeFirstLetter(p.body);

                    resPosts.push(p)
                }
            })
        });

        return resPosts
    }

    getAllCityForSelector(users) {
        let cityList = [];
        users.forEach((u) => {
            cityList.indexOf(u.address.city) === -1 && cityList.push(u.address.city)
        });
        return cityList
    }

    getAllCompanyForSelector(users) {
        let companyList = [];
        users.forEach((u) => {
            companyList.indexOf(u.company.name) === -1 && companyList.push(u.company.name)
        });
        return companyList
    }

    cityFilter(city) {
        let resPosts = postsRes.filter((c) => {
            return c.cityName === city
        });
        this.setState({posts: resPosts})
    }

    companyFilter(company) {
        let resPosts = postsRes.filter((c) => {
            return c.companyName === company
        });
        this.setState({posts: resPosts})
    }

    utilForSortBy(type) {
        this.setState({
            posts: this.state.posts.sort((a, b) => {
                if (a[type] < b[type])
                    return -1;
                if (a[type] > b[type])
                    return 1;
                return 0;
            })
        });
    }

    sortBy(type) {
        switch (type) {
            case 'author':
                this.utilForSortBy('authorName');
                break;
            case 'city':
                this.utilForSortBy('cityName');
                break;
            case 'company':
                this.utilForSortBy('companyName');
                break;
            default:
        }
    }

    searchByTitle(val) {
        let resPosts = postsRes.filter((c) => {
            return c.title.includes(val)
        });
        this.setState({posts: resPosts})
    }

    deletePost(postId) {
        this.state.posts.forEach((p) => {
            if (p.id === postId) {
                this.state.posts.splice(p, 1)
            }
        });
        this.setState({posts: this.state.posts})
    }

    render() {
        let state = this.state;
        return (
            <div className="App">
                <div>
                    <nav>
                        <label>City filter:
                            <select
                                onChange={(e) => this.cityFilter(e.target.value)}>{state.cityList.map((city, index) => {
                                return (
                                    <option key={index} value={city}>{city}</option>
                                )
                            })}
                            </select>
                        </label>
                        <label>Company filter:
                            <select
                                onChange={(e) => this.companyFilter(e.target.value)}>{state.companyList.map((company, index) => {
                                return (
                                    <option key={index} value={company}>{company}</option>
                                )
                            })}
                            </select>
                        </label>
                        <label>Quick search by post title <input type="text" onChange={(e) => {
                            this.searchByTitle(e.target.value)
                        }}/></label>
                        <label>Sort by:
                            <select onChange={(e) => this.sortBy(e.target.value)}>
                                <option value="author">Author name</option>
                                <option value="city">City name</option>
                                <option value="company">Company name</option>
                            </select>
                        </label>
                    </nav>
                </div>

                <div>
                    {state.posts.map((p) => {
                        return (
                            <article key={p.id}>
                                <h2>{p.title}</h2>
                                <span>{p.authorName}</span> - <span>{p.companyName}</span> - <span>{p.cityName}</span>
                                <p>{p.body}</p>
                                <button onClick={() => {
                                    this.deletePost(p.id)
                                }}>X
                                </button>
                            </article>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default App;
