((Utils) => {
    const App = {
        htmlElements: {
            pokemonForm: document.getElementById('pokemon-form'),
            pokemonFormNameInput: document.getElementById('pokemon-name-input'),
            pokemonFormInputOptions: document.getElementById('pokemon-form-options'),
            pokemonFinderOutput: document.getElementById('pokemon-finder-output')
        },
        settings: {

        },
        utils: {
            ...Utils,
            getPokemonGeneralData: async (name, img) => {
                try {
                    const rawResponse = await App.utils.getDataFromBack({
                        name,
                        searchType: 'pokemon'
                    });
                    if (rawResponse.data) {
                        return App.templates.pokemonGeneralData(rawResponse, img);
                    }
                    else {
                        throw new Error('pokemon sin resultado');
                    }
                }
                catch (error) {
                    console.log(error)
                    return App.templates.errorCard(error)
                }
            },
            getPokemonEvolutionData: async (name) => {

                try {
                    const rawResponse = await App.utils.getDataFromBack({
                        name,
                        searchType: 'species'
                    });
                    const evolutionDataResponse = rawResponse.data
                    const evolutionsData = App.utils.getPokemonEvolutions(evolutionDataResponse.chain)
                    return App.templates.pokemoneEvolutionData(evolutionsData)
                }
                catch {

                }
            },
            getPokemonUbicacionData: async (name) => {
                try {
                    const rawResponse = await App.utils.getDataFromBack({
                        name,
                        searchType: 'encounters'
                    });
                    responseData = rawResponse.data

                    return App.templates.pokemonUbicacionData(responseData);
                    //App.utils.getUbicacionDetails(responseData)
                }
                catch (error) {

                }
            }
        },
        templates: {
            pokemonGeneralData: (responseObject, img) => {

                //console.log(responseObject.data)
                const data = responseObject.data
                var template = `
                <section class="pokemon-general-output2">
                <section id="pokemon-general-data" class="pokemon-general-data2">
                   <p>Date : ${responseObject.date}</p>
                </section>
            </section>
                <section class="pokemon-general-output">
                <section id="pokemon-general-data" class="pokemon-general-data">
                <h3>${App.utils.capitalize(data.name)} (${data.id})</h3>
                <h4>Peso/Altura</h4>
                <h4>${data.weight}/${data.height}</h4>
                <br>
                <section id="pokemon-general-data-optional">`;

                if (img) {
                    template += `
                    <h3>Sprites</h3>
                    <section class="pokemon-sprites">
                        <section class="default-sprites">
                        <img  src="${data.sprites.front_default}" alt="">
                        <img  src="${data.sprites.back_default}" alt="">
                        <p>Default</p>
                        </section>
                        <section class="shiny-sprites">
                        <img  src="${data.sprites.front_shiny}" alt="">
                            <img  src="${data.sprites.back_shiny}" alt="">
                            <p>Shiny</p>
                        </section>
                    </section>`;
                } else {
                    const pokemonAbilities = data.abilities.map(
                        ({ ability, is_hidden }) =>
                            `<li>${App.utils.capitalize(ability.name)} ${is_hidden ? `<img src="assets/svg/ojo.svg" alt="">` : ""
                            }</li>`
                    );
                    template += `
                    <h3>Habilidades</h3>
                    <ul>
                        ${pokemonAbilities.join("")}
                    </ul>`
                }
                template += `</section>
            </section>
            <br>
            <section class="pokemon-general-data" id="pokemon-general-data">
                <h3>Estadísticas</h3>
                <ul>
                    <li>
                        <label for="hp">HP</label><br>
                        <progress id="hp" max="180" value="${data.stats[0].base_stat}"></progress>
                    </li>
                    <li>
                        <label for="hp">ATT</label><br>
                        <progress id="hp" max="180" value="${data.stats[1].base_stat}"></progress>
                    </li>
                    <li>
                        <label for="hp">DEF</label><br>
                        <progress id="hp" max="180" value="${data.stats[2].base_stat}"></progress>
                    </li>
                    <li>
                        <label for="hp">S.ATT</label><br>
                        <progress id="hp" max="180" value="${data.stats[3].base_stat}"></progress>
                    </li>
                    <li>
                        <label for="hp">S.DEF</label><br>
                        <progress id="hp" max="180" value="${data.stats[4].base_stat}"></progress>
                    </li>
                    <li>
                        <label for="hp">SPD</label><br>
                        <progress id="hp" max="180" value="${data.stats[5].base_stat}"></progress>
                    </li>
                </ul>
                
            </section>
            </section>
                `;

                return template;
            },
            pokemoneEvolutionData: (evolutionsObject) => {
                const pokemonEvolutions = evolutionsObject.length > 1 ? evolutionsObject.map(
                    ({ name, is_baby }) =>
                        `<li>${name} ${is_baby ? `<img src="assets/svg/bebe.svg" alt="">` : ""
                        }</li>`
                ) : ['<li>Sin evolución</li>'];

                return `
                <section class="pokemon-evolutions-data">
                <section class="pokemon-evolutions-data-child">
                    <section class="" >
                        <h4 class="h3">Cadena Evolutiva</h4>
                        <ul>
                            ${pokemonEvolutions.join("")}
                        </ul>
                    </section>
                </section>
            </section>
                `
            },
            pokemonUbicacionData: (ubicacionObject) => {

                if (ubicacionObject.length <= 0) {
                    return `
                    <section class="pokemon-ubicacion-data">
                    <section class="pokemon-ubicacion-data-child">                        
                        <h4 class="h3">Sin ubicacion</h4>
                    </section>
                    </section>
                    `;
                }
                let template = `
                <section class="pokemon-ubicacion-data">
                <section class="pokemon-ubicacion-data-child">
                <h4 class="h3">Ubicación</h4>
                    <table class="pokemon-ubicacion-data-table">
                        <tr >
                            <th class="table-data1">Ubicación</th>
                            <th class="table-data">Juegos</th>
                            <th class="table-data">Método</th>
                            <th class="table-data">Nivel Min</th>
                            <th class="table-data">Nivel Max</th>
                        </tr>`;

                ubicacionObject.map((key) => {
                    template += `
                            <tr>
                            <td class="table-data">${App.utils.capitalize(key.location_area.name)}</td>
                            <td class="table-data">
                                <ul>`;
                    const otro = [key.version_details[0].encounter_details[0]];
                    const juegos = key.version_details
                    juegos.map((e) => {
                        template += `<li>${App.utils.capitalize(e.version.name)}</li>`
                    })
                    otro.map((e) => {
                        template += `</ul>
                                    </td>
                                    <td class="table-data">${e.method.name}</td>
                                    <td class="table-data">${e.min_level}</td>
                                    <td class="table-data">${e.max_level}</td>
                                    </tr>`
                    })
                })
                template += `</table>
                </section>
            </section>`;
                return template;
            },
            errorCard: (error) => {
                return ` 
                <section class="pokemon-general-output2">
                <div class="">
                <h3>${error}</h3>
                </div>
                </section>
                            `;
            },
        },
        handlers: {
            pokemonFormOnSubmit: async (e) => {
                e.preventDefault()
                var template = "";
                const pokemonName = App.htmlElements.pokemonFormNameInput.value.trim().toLowerCase();

                if (pokemonName.length == 0) {
                    template = App.templates.errorCard("Formulario Incompleto")
                    App.htmlElements.pokemonFinderOutput.innerHTML = template;
                    return
                }

                const options = App.htmlElements.pokemonFormInputOptions.childNodes
                const optionSelect = App.utils.getCheckedBoxes(options)

                template = await App.utils.getPokemonGeneralData(pokemonName, optionSelect['sprites'] ? true : false)

                if (optionSelect['evoluciones']) {
                    template += await App.utils.getPokemonEvolutionData(pokemonName)
                }
                if (optionSelect['ubicacion']) {
                    template += await App.utils.getPokemonUbicacionData(pokemonName)
                }

                App.htmlElements.pokemonFinderOutput.innerHTML = template
            }
        },
        init: () => {
            App.htmlElements.pokemonForm.addEventListener('submit', App.handlers.pokemonFormOnSubmit)
        }
    }
    App.init();
})(document.Utils)