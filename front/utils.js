(()=>{
    const Utils = {
        settings : {
            backendBaseUrl: "http://localhost:3000/api"
        },
        getFormatUrl : (name,searchType) => {
            return `${Utils.settings.backendBaseUrl}/${searchType}/${name}`
        },
        getDataFromBack : ({name, searchType = "pokemon"}) => {
            return Utils.fetch({
                url:Utils.getFormatUrl(name,searchType),
                searchType
            })
        },
        fetch : async ({url, searchType}) => {
            try{        
                const rawReponse = await fetch(url);
                if(rawReponse.status != 200){
                    throw new Error (`${searchType} sin resultado`);
                }
                return rawReponse.json();
            }
            catch(error) {
                //console.log(error)
                throw error;
            }
        },
        getCheckedBoxes : (boxes) => {
            const boxesChecked = {}               
            for(let x = 0; x < boxes.length; x++){
                if(boxes[x].type === 'checkbox' && boxes[x].checked ){
                   boxesChecked[boxes[x].id]=true
                }
            }
            return boxesChecked;
        },
        getPokemonEvolutions: (chain) => {
            const evolve_chain = [];

            function getEvolve(chain) {
                evolve_chain.push({
                    name: Utils.capitalize(chain.species.name),
                    is_baby: chain.is_baby
                });
                for (let x = 0; x < chain.evolves_to.length; x++) {
                    getEvolve(chain.evolves_to[x])
                }
            }

            getEvolve(chain)
            return evolve_chain;

        },
        capitalize : (str) => {
            return str.charAt(0).toUpperCase()+str.slice(1).replace(/[^\w]/g,' ');
        }
    }
    document.Utils = Utils;
})()