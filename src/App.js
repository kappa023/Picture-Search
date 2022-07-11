
import { useRef,useState,useEffect } from 'react';
import './App.css';
import ImageGrallery from './components/ImageGrallery';
import ReactPaginate from 'react-paginate';


function App() {
  const[fetchData,setFetchData] = useState([]);
  const[pageCount,setPageCount] = useState();
  const[currentPage,setCurrentPage] = useState(0);
  const[isVisible, setIsVisible] = useState(false)
  const[paginateFrg,setPaginateFrg] = useState(false);

  const toggleVisibility = () => {
    window.scrollY > 0
      ? setIsVisible(true)
      : setIsVisible(false)
    }
  
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  

  const ref = useRef();
  const APIKEY = process.env.React_APP_OPENWEATHERMAP_API_KEY;
  let endpointURL = `https://pixabay.com/api/?key=${APIKEY}&image_type=photo&per_page=12`

  //Search box
  const handleSubmit = (e) => {
    e.preventDefault();
    if(ref.current.value === "")  
    return [setFetchData([]), setPageCount('')];
    endpointURL += `&q=${ref.current.value}`
    //API
     fetch(endpointURL)
      .then((res) => {
        return res.json();

      }).catch(error => {
        console.log('取得失敗しました。');
      })
      //dataに格納
      .then((data)=> {
        if(!data.hits.length) {
           setPaginateFrg(true);
        } else{
          setPaginateFrg(false);
          setPageCount(data.totalHits / 12);
          setFetchData(data.hits);
          setCurrentPage(0);
        }






      })
    
  } 

  //pagenation click
  const handlePageClick  =(data)=>{

    window.scrollTo(0, 0);
    let pageIndex =  data.selected + 1;
    setCurrentPage(data.selected);
    endpointURL += `&page=${pageIndex}`;

     fetch(endpointURL)
      .then((res) => {
        return res.json();

      }).catch(error => {
        console.log('取得失敗しました。');
      })
      //dataに格納
      .then((data)=> {
        setFetchData(data.hits);
        

      })

  };

  const returnTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container">
     <h2>Picture Search</h2>
     <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="画像を探す" ref={ref}/>
     </form>
     <ImageGrallery fetchData={fetchData}/>
     {pageCount &&
     <ReactPaginate
        forcePage={currentPage} 
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName="pagination justify-content-center mt-5"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLinkClassName="page-link"
        activeClassName="active"

     />}

    {paginateFrg &&"検索条件に一致する画像は見つかりませんでした。"}
    
    <div className={isVisible? "pagetop is-show " :"pagetop" } onClick={returnTop}  >^</div>
    </div>

  );
}

export default App;
