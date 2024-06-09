import { useEffect, useState } from "react"
import './articlepage.css'

export default function ArticlePage() {
    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(APISwapper())
            .then(response => response.json())
            .then((data) => {
                setArticle(data);
            })
            .then(setLoading(false))
            .catch((error) => console.log(error))
    }, [])

    function APISwapper() {
        if (location.pathname.includes('/article/')) {
            const url = window.location.href;
            const urlSplit = url.split('/');
            const id = urlSplit[urlSplit.length - 1];
            return `https://midaiganes.irw.ee/api/list/${id}`
        } else {
            return 'https://midaiganes.irw.ee/api/list/972d2b8a'
        }
    }

    if (!article || !article.title) {
        if (loading) {
            return <p>...Loading</p>
        }
        return <p>No Data To Show</p>
    }
    return (
        <main className="content">
            <h1>{article.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: article.intro }}></div>
            <img src={article.image.large} alt={article.image.alt} title={article.image.title} className="main-image" />
            <div className="image-caption">{article.image.title}</div>
            <div dangerouslySetInnerHTML={{ __html: article.body }}></div>
            <div>
                <ul>
                    {article.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
