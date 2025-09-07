import {API_URL} from "../../../(home)/page";
import {Suspense} from "react";
import MovieInfo from "../../../../components/movie-info";
import MovieVideos from "../../../../components/movie-videos";





export default async function MovieDetail({params: {id}, searchParams}: { params: { id: string }, searchParams: {} }) {
    // console.log(id, await searchParams);
    // const movie = await getMovie(id);
    return(
        <div>
            <Suspense fallback={"Loading Movie info"}>
                <MovieInfo id={id}/>
            </Suspense>
            <p>-----------------------------------------</p>
            <Suspense fallback={(<h1>Loading Movie Videos</h1>)}>
                <MovieVideos id={id}/>
            </Suspense>
        </div>
    )
}