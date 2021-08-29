import React,{useState,useContext} from 'react';
import MarkedCityContext from '../Context/MarkedCityContext'
import LatLngContext from '../Context/LatLngContext'

import {
    Button,
    Alert
} from 'reactstrap'
import {Container,Row,Col} from "reactstrap"
import {Polyline} from 'react-leaflet'
const Dashboard = ()=>{  
    const {markedCities} = useContext(MarkedCityContext);
    const {setMarkedCities} = useContext(MarkedCityContext);
    const {latlngs,setLatlngs} = useContext(LatLngContext);

    class Edge {
        constructor(src, dest,weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
        }
    }

    class Sets
    {
        constructor(parent, rank){
            this.parent = parent;
            this.rank = rank;
        }
    }
    function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit==="K") { dist = dist * 1.609344 }
		if (unit==="N") { dist = dist * 0.8684 }
		return dist;
	}
}

    const MSTCalculate = ()=> {
        var edges = CalculateEdges();
        var sets = [];
        // const [latlngs,setLatlngs] = useState([]);
        edges.sort((a,b) => (a.weight > b.weight) ? 1 : ((b.weight > a.weight) ? -1 : 0));
        for(let i=0;i<markedCities.length;i++)
        {
            sets.push(new Sets(i,0));
        }
        
            var result = [];
        for(let i=0;i<edges.length;i+=2)
        {
            var next_edge = edges[i];
            var x = find(sets,next_edge.src);
            var y = find(sets,next_edge.dest);

            if(x!=y)
           {
               Union(sets,x,y);
               result.push(next_edge);
               let markedCity1 = markedCities[next_edge.src];
               let markedCity1Lat = markedCity1.position.lat;
               let markedCity1Lng = markedCity1.position.lng;
               
               let markedCity2 = markedCities[next_edge.dest];
               let markedCity2Lat = markedCity2.position.lat;
               let markedCity2Lng = markedCity2.position.lng;

                setLatlngs(latlngs=>[...latlngs,
                    
                        {
                            from_lat: markedCity1Lat,
                            from_long: markedCity1Lng,
                            to_lat: markedCity2Lat,
                            to_long: markedCity2Lng
                        }
                    
                ]);
           }
        }
        result.sort((a,b) => (a.src > b.src) ? 1 : ((b.src > a.src) ? -1 : 0));
    }

    const CalculateEdges = () =>{
        var edges = [];
        for(var i=0;i<markedCities.length;i++)
        {
             var markedCity1 = markedCities[i];
             var markedCity1Lat = markedCity1.position.lat;
             var markedCity1Lng = markedCity1.position.lng;
            for(var j=0;j<markedCities.length;j++)
            {
                if(i!=j)
                {
                    var markedCity2 = markedCities[j];
                    var markedCity2Lat = markedCity2.position.lat;
                    var markedCity2Lng = markedCity2.position.lng;
                    var distanceBetweenTwoCitites = distance(markedCity1Lat,markedCity1Lng,markedCity2Lat,markedCity2Lng);
                    edges.push(new Edge(i,j,distanceBetweenTwoCitites));
                }
                
            }
        }
        return edges;
    }

    const find = (sets,x)=>{
        if(sets[x].parent!==x)
           sets[x].parent=find(sets,sets[x].parent);
            
        return sets[x].parent;
    }

    function Union(sets,x,y)
    {
        var xroot = find(sets,x);
        var yroot = find(sets,y);

        if(sets[xroot].rank<sets[yroot].rank)
            sets[xroot].parent = yroot;
        else if(sets[yroot].rank<sets[xroot].rank)
            sets[yroot].parent = xroot;
        else
        {
            sets[xroot].parent = yroot;
            sets[yroot].rank=sets[yroot].rank+1;
        }
    }

    const DijkCalculate = (src,dest)=> {
        src = 0; dest=2;
        var result = new Array(markedCities.length);
        var visited = new Array(markedCities.length);

        var mat = new Array(markedCities.length);

        for(var i=0;i<markedCities.length;i++)
        {
            mat[i] = new Array(markedCities.length);
        }
        CalculateEdgesForDijk(mat);
        result.fill(Number.MAX_SAFE_INTEGER);
        result[src] = 0;
        
        visited.fill(false);
        
        for(let k=0;k<markedCities.length-1;k++)
        {
            var index = findMin(result,visited,markedCities.length);
            //System.out.println(index);
            visited[index] = true;
            
            //for(let i=0;i<markedCities.length;i++)
            //{
                if(!visited[dest] && result[index]+mat[index][dest]<result[dest] && mat[index][dest]!=0)
                {
                    //System.out.println(g.get(index).get(i));
                    result[dest] = result[index]+mat[index][dest];
                }
            //}
                alert("Result is: "+result[dest])
                return result;
        }
    }
    const CalculateEdgesForDijk = (mat) =>{
      
        for(var i=0;i<markedCities.length;i++)
        {
             var markedCity1 = markedCities[i];
             var markedCity1Lat = markedCity1.position.lat;
             var markedCity1Lng = markedCity1.position.lng;
            for(var j=0;j<markedCities.length;j++)
            {
                if(i!=j)
                {
                    var markedCity2 = markedCities[j];
                    var markedCity2Lat = markedCity2.position.lat;
                    var markedCity2Lng = markedCity2.position.lng;
                    var distanceBetweenTwoCitites = distance(markedCity1Lat,markedCity1Lng,markedCity2Lat,markedCity2Lng);
                    mat[i][j] = distanceBetweenTwoCitites;
                }   
            }
        }
    }

    const findMin = (result,visited,V)=>
    {
        var mini = Number.MAX_SAFE_INTEGER;
        var miniIndex = 0;
        for(let i=0;i<V;i++)
        {
            if(result[i]<=mini && !visited[i])
            {
                mini = result[i];
                miniIndex = i;
            }
        }
        return miniIndex;
    }

    return (
        <div className="buttons" style={{position: "absolute",right: "20px",
        top: "20px",
        zIndex: "400",
       }}>
       

            <Button color="success" onClick={MSTCalculate}>Implement MST</Button>
            <Alert className="instruction" color="primary">
            Tap on the cities.
        </Alert>
              {/* <Button color="success" onClick={DijkCalculate}>Implement Dijkstra</Button>  */}
        </div>
         
       
    )
}

export default Dashboard;