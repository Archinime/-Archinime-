const animes = [
    {
        "id": 1,
        "title": "DAN DA DAN",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/dan.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Comedia oscura",
            "Romance",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776565311098,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/dan2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 2,
        "title": "Jujutsu Kaisen",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Jujutsu.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Fantasía oscura",
            "Nekketsu",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776565658103,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/jujutsu3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 3,
        "title": "KonoSuba!",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/konosubaportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Comedia",
            "Ecchi",
            "Fantasía",
            "Isekai",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776566285286,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/konosuba_ova3.avif",
        "latestBlockName": "Ova 3",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "Kono subarashii sekai ni shukufuku o!"
        ]
    },
    {
        "id": 4,
        "title": "Re:Zero − Empezar vida en otro mundo",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/rezeroportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Isekai",
            "Romance",
            "Terror psicológico",
            "Thriller psicológico",
            "Shōnen"
        ],
        "lastUpdate": 1775663031924,
        "updateType": "ESTRENO 🚨",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/rezerot4.avif",
        "latestBlockName": "Temporada 4",
        "latestEpTitle": "Capítulo 1",
        "isFinal": false,
        "aliases": [
            "Rezero"
        ]
    },
    {
        "id": 5,
        "title": "Mushoku Tensei",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mushoku.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Ecchi",
            "Fantasía",
            "Harem",
            "Isekai",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1776566500946,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mushoku2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false
    },
    {
        "id": 6,
        "title": "Tensei Shitara Slime Datta Ken",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/slime.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Fantasía",
            "Isekai",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776567039615,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/slime3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false,
        "aliases": [
            "That Time I Got Reincarnated as a Slime"
        ]
    },
    {
        "id": 7,
        "title": "Saga of Tanya the Evil (Youjo Senki)",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/tanya.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Drama",
            "Fantasía",
            "Militar",
            "Seinen"
        ],
        "lastUpdate": 1776567256710,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/tanya_ova.avif",
        "latestBlockName": "Ova 1",
        "latestEpTitle": "Capítulo 1",
        "isFinal": false,
        "aliases": [
            "Yōjo Senki"
        ]
    },
    {
        "id": 8,
        "title": "Akame Ga Kill",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Akame1.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Romance",
            "Tragedia",
            "Shōnen"
        ],
        "lastUpdate": 1776567409876,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/akame11.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false,
        "aliases": [
            "Akame ga Kiru"
        ]
    },
    {
        "id": 9,
        "title": "To Be Hero X",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/hero.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Animación",
            "Comedia",
            "Fantasía",
            "Superhéroes",
            "Seinen"
        ],
        "lastUpdate": 1776567586218,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/hero1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false
    },
    {
        "id": 10,
        "title": "Demon Slayer",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/demon.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776568006795,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/demonslayer_pelicula2.avif",
        "latestBlockName": "Película 2",
        "latestEpTitle": "Castillo Infinito",
        "isFinal": false,
        "aliases": [
            "Kimetsu no Yaiba"
        ]
    },
    {
        "id": 11,
        "title": "Maou 2099",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/maou2099.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Cyberpunk",
            "Fantasía",
            "Isekai Inverso",
            "Shōnen"
        ],
        "lastUpdate": 1776568255656,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/maou2099t1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 12,
        "title": "Tsue to Tsurugi no Wistoria",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/wistoria.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776568559618,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/wistoria1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 13,
        "title": "Izure Saikyou no Renkinjutsushi",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/izure.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Comedia",
            "Fantasía",
            "Isekai",
            "Shōnen"
        ],
        "lastUpdate": 1776568700851,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/izure1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Possibly the Greatest Alchemist of All Time"
        ]
    },
    {
        "id": 14,
        "title": "Alya Sometimes Hides Her Feelings in Russian",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/alya.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Romance",
            "Josei"
        ],
        "lastUpdate": 1776568869289,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/alya1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san"
        ]
    },
    {
        "id": 15,
        "title": "Reborn as a Vending Machine",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/jidou.avif",
        "rating": 4.1,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Comedia",
            "Fantasía",
            "Isekai",
            "Shōnen"
        ],
        "lastUpdate": 1776569203417,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/jidou2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Jidōhanbaiki ni Umarekawatta Ore wa Meikyū ni Samayō"
        ]
    },
    {
        "id": 16,
        "title": "Kimi to Boku no Saigo no Senjou",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kimitoboku.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Fantasía",
            "Militar",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1776569408897,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kimitoboku2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Our Last Crusade or the Rise of a New World"
        ]
    },
    {
        "id": 17,
        "title": "The Gorila God's Go- To Girl",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/gorila.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Fantasía",
            "Romance",
            "Shōjo"
        ],
        "lastUpdate": 1776569564225,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/gorila1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Gorilla no Kami Kara Kago Sareta Reijō wa Ōritsu Kishidan de Kawaiigareru"
        ]
    },
    {
        "id": 18,
        "title": "Chainsaw Man",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ChainsawMan.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia oscura",
            "Fantasía oscura",
            "Shōnen"
        ],
        "lastUpdate": 1776569745509,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ChainsawMan2.avif",
        "latestBlockName": "Película 1",
        "latestEpTitle": "El Arco de Reze",
        "isFinal": false
    },
    {
        "id": 19,
        "title": "The Rising of the Shield Hero",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Heroe_Escudo.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía",
            "Isekai",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1776570338573,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Heroe_Escudo4.avif",
        "latestBlockName": "Temporada 4",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Tate no Yuusha no Nariagari",
            "El Héroe del Escudo"
        ]
    },
    {
        "id": 20,
        "title": "Overflow",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/overflow.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Escolar",
            "Harem",
            "Hentai",
            "Incesto",
            "Romance",
            "Seijin"
        ],
        "lastUpdate": 1776570522521,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/overflow1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 8",
        "isFinal": false
    },
    {
        "id": 21,
        "title": "Shiunji-ke no Kodomotachi",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Shiunji-ke.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Harem",
            "Romance",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1776572257702,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Shiunji-ke1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 22,
        "title": "Goblin Slayer",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/goblinslayerportada.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Fantasía",
            "Fantasía oscura",
            "Horror",
            "Seinen"
        ],
        "lastUpdate": 1776572440117,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Goblin_Slayer2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 23,
        "title": "Kanchigai no Atelier Meister",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/atelier.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776572654050,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/atelier1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 24,
        "title": "Definitivamente. ¡No me gusta mi hermano para nada!",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Onii-chan_no_Koto.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Ecchi",
            "Harem",
            "Romance",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1776572872336,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Onii-chan_no_Koto_ova.avif",
        "latestBlockName": "Ova 1",
        "latestEpTitle": "Capítulo 1",
        "isFinal": false
    },
    {
        "id": 25,
        "title": "Kaiju No. 8",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kaijun8.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Fantasía oscura",
            "Kaiju",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776573054219,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kaijun82.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false
    },
    {
        "id": 26,
        "title": "Zootopia",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/zootopia.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Animación",
            "Aventura",
            "Comedia",
            "Familiar",
            "Infantil",
            "Misterio",
            "Policial",
            "Kodomo"
        ],
        "lastUpdate": 1776573340151,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/zootopia2.avif",
        "latestBlockName": "Zootopia 2",
        "latestEpTitle": "Capítulo 1",
        "isFinal": false
    },
    {
        "id": 27,
        "title": "Clevatess -Majuu no Ou to Akago",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/clevatess.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Fantasía",
            "Seinen"
        ],
        "lastUpdate": 1776573459172,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/clevatess1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 28,
        "title": "Dr. Stone",
        "img": "Dr._Stoneportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Divulgación Científica",
            "Post-apocalíptico",
            "Shōnen"
        ],
        "lastUpdate": 1775744786922,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/stone4.avif",
        "latestBlockName": "Temporada 4 Parte III - FINAL",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 29,
        "title": "One Piece (Live Action)",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/onepiece.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Drama",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776573657096,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/onepiece2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 8",
        "isFinal": true
    },
    {
        "id": 30,
        "title": "Shoujo Ramune",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/shoujoramune.avif",
        "rating": 4.3,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Harem",
            "Hentai",
            "Incesto",
            "Seijin"
        ],
        "lastUpdate": 1776573775716,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/shoujoramune1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 5",
        "isFinal": false
    },
    {
        "id": 31,
        "title": "To Your Eternity",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ToYourEternity.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Drama",
            "Fantasía",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1776573958866,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ToYourEternity3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 22",
        "isFinal": true,
        "aliases": [
            "Fumetsu no Anata e"
        ]
    },
    {
        "id": 32,
        "title": "Tsugunai Subbed",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TsugunaiSubbed.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Escolar",
            "Harem",
            "Hentai",
            "Seijin"
        ],
        "lastUpdate": 1776574161481,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TsugunaiSubbed1.avif",
        "latestBlockName": "Episodio 1",
        "latestEpTitle": "Capítulo 1",
        "isFinal": false
    },
    {
        "id": 33,
        "title": "Blue Lock",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Bluelock.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Deportivo",
            "Psicológico",
            "Survival Game",
            "Thriller",
            "Shōnen"
        ],
        "lastUpdate": 1776574387484,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Bluelock2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 14",
        "isFinal": false,
        "aliases": [
            "Yoichi Isagi"
        ]
    },
    {
        "id": 34,
        "title": "Magic Maker: Isekai Mahou no Tsukurikata",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/MagicMaker.avif",
        "rating": 4.4,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Fantasía",
            "Isekai",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776574551581,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/MagicMaker1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Magic Maker: How to Make Magic in Another World"
        ]
    },
    {
        "id": 35,
        "title": "Tsuyokute New Saga",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/NewSaga.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Drama",
            "Fantasía",
            "Isekai",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776574914979,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/NewSaga1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "New Saga"
        ]
    },
    {
        "id": 36,
        "title": "Gachiakuta",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Gachiakuta.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía",
            "Fantasía oscura",
            "Shōnen"
        ],
        "lastUpdate": 1776575038308,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Gachiakuta1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false
    },
    {
        "id": 37,
        "title": "Shinsei Kourin Dacryon Luna",
        "img": "Shinsei Kourin Dacryon Luna portada.avif",
        "rating": 4,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Tentáculos",
            "Hentai",
            "Fantasía",
            "Fantasía oscura",
            "Seijin"
        ]
    },
    {
        "id": 38,
        "title": "Kami-tachi ni Hirowareta Otoko",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Kamitachi.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Fantasía",
            "Isekai",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776575237355,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Kamitachi2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "By the Grace of the Gods"
        ]
    },
    {
        "id": 39,
        "title": "Ore dake Haireru Kakushi Dungeon",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/oredake.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Ecchi",
            "Fantasía",
            "Harem",
            "Romance",
            "Shōnen"
        ],
        "lastUpdate": 1776575375241,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/oredake1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "The Hidden Dungeon Only I Can Enter"
        ]
    },
    {
        "id": 40,
        "title": "One Punch-Man",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/onepunch.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Comedia",
            "Fantasía",
            "Superhéroes",
            "Seinen"
        ],
        "lastUpdate": 1776576001810,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/onepunch3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "One-Punch Man"
        ]
    },
    {
        "id": 41,
        "title": "Mashle",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mashle.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776576152812,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mashle2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Mash Burnedead"
        ]
    },
    {
        "id": 42,
        "title": "Los Diarios de la Boticaria",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/LosDiariosdelaBoticaria.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Drama",
            "Misterio",
            "Romance",
            "Shōjo"
        ],
        "lastUpdate": 1776576521985,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/LosDiariosdelaBoticaria2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false,
        "aliases": [
            "Kusuriya no Hitorigoto",
            "The Apothecary Diaries"
        ]
    },
    {
        "id": 43,
        "title": "Maplestar",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/maplestar.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Animación",
            "Hentai",
            "Seijin"
        ],
        "lastUpdate": 1776577215563,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/rezee.avif",
        "latestBlockName": "Clases Con Reze",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 44,
        "title": "Uzumaki",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/uzumaki.avif",
        "rating": 4.2,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Horror",
            "Seinen"
        ],
        "lastUpdate": 1776577473827,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/uzumaki1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 4",
        "isFinal": false
    },
    {
        "id": 45,
        "title": "Tondemo Skill de Isekai Hourou Meshi",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/todemo.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Cocina",
            "Comedia",
            "Fantasía",
            "Isekai",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776577662900,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/todemo2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Campfire Cooking in Another World with My Absurd Skills"
        ]
    },
    {
        "id": 46,
        "title": "My Dress-Up Darling",
        "aliases": [
            "Sono Bisque Doll wa Koi wo Suru"
        ],
        "img": "muneca.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Romance",
            "Slice of Life",
            "Escolar",
            "Cosplay",
            "Seinen"
        ]
    },
    {
        "id": 47,
        "title": "Hazbin Hotel",
        "img": "hhzz.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Animación",
            "Comedia",
            "Drama",
            "Musical",
            "Policial",
            "Seijin"
        ],
        "lastUpdate": 1769033282341,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/iz2jt0avm2d625tjb8trq/Airbrush-Image-Enhancer-1761697102126.jpg?rlkey=isj2usvel3oh22io1o620lfoi&st=8laf3wdv&raw=1",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 8",
        "isFinal": false,
        "aliases": [
            "Hotel Hazbin"
        ]
    },
    {
        "id": 48,
        "title": "The Eminence in Shadow",
        "aliases": [
            "Kage no Jitsuryokusha ni Naritakute!"
        ],
        "img": "shadow.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Acción",
            "Fantasía",
            "Isekai",
            "Harem",
            "Steampunk",
            "Shōnen"
        ]
    },
    {
        "id": 49,
        "title": "Spy × Family",
        "img": "spy.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1769402924356,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/mtki74k5zzzywfdegb4ir/dfffffg.jpg?rlkey=g563wasphqjhhyep83qnq548r&st=9uw7j6kq&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 13",
        "isFinal": true
    },
    {
        "id": 50,
        "title": "Black Clover",
        "img": "portbla.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Acción",
            "Fantasía",
            "Aventura",
            "Shōnen"
        ]
    },
    {
        "id": 51,
        "title": "My Hero Academia",
        "img": "sgsgsdseg.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Drama",
            "Escolar",
            "Fantasía",
            "Superhéroes",
            "Shōnen"
        ],
        "lastUpdate": 1768755604711,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1udlgl7s87fdvmwi7mp2l/Airbrush-IMAGE-ENHANCER-1762698551862-1762698551862.jpg?rlkey=e8rdhex2nwtlhyl6nume5oq9t&st=ojvzr0lg&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": true,
        "aliases": [
            "Boku no Hero"
        ]
    },
    {
        "id": 52,
        "title": "Kakkou no Linazuke",
        "aliases": [
            "A Couple of Cuckoos"
        ],
        "img": "pordf.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Romance",
            "Comedia",
            "Escolar",
            "Harem",
            "Shōnen"
        ]
    },
    {
        "id": 53,
        "title": "Futari Solo Camp",
        "img": "futaripor.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Romance",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1768678787339,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/tmonp4atoj90k87ojxtdf/Airbrush-IMAGE-ENHANCER-1763472470283-1763472470284.jpg?rlkey=ctc7gslr2ttsotj67parqf8ai&st=n96z3g28&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false,
        "aliases": [
            "Solo Camping for Two"
        ]
    },
    {
        "id": 54,
        "title": "Tojima Tanzaburō wa Kamen Rider ni Naritai",
        "img": "tojima1.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Tokusatsu",
            "Seinen"
        ],
        "lastUpdate": 1775934120087,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1acwpuwtsx2f20urv44eo/Airbrush-IMAGE-ENHANCER-1763730194883-1763730194884.jpg?rlkey=ornue772yaoazcagrsinqj1fc&st=nlz517kl&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24",
        "isFinal": true,
        "aliases": [
            "Tojima Wants to Be a Kamen Rider"
        ]
    },
    {
        "id": 55,
        "title": "Alma-chan wa Kazoku ni Naritai",
        "img": "almachan.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Ciencia ficción",
            "Comedia",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1768672215669,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/en905hoqulm0ih9epmjcf/almachan1.jpg?rlkey=dm7s8l0lhplo8eshfsgj7fdyk&st=ji8mmsmi&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "aliases": [
            "Alma-chan Wants to Be a Family!"
        ]
    },
    {
        "id": 56,
        "title": "Spice and Wolf",
        "aliases": [
            "Okami to Kōshinryō"
        ],
        "img": "drgfedfgdf.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Romance",
            "Ciencia ficción",
            "Aventura",
            "Fantasía",
            "Drama",
            "Seinen"
        ]
    },
    {
        "id": 57,
        "title": "Oyasumi Sex",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/oyasumi1.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Hentai",
            "Romance",
            "Slice of Life",
            "Seijin"
        ],
        "lastUpdate": 1776565116288,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/oyasumii.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 4",
        "isFinal": false
    },
    {
        "id": 58,
        "title": "Rick and Morty",
        "aliases": [
            "Rick y Morty"
        ],
        "img": "rymp.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Animación",
            "Acción",
            "Ciencia ficción",
            "Aventura",
            "Comedia",
            "Comedia oscura",
            "Gag",
            "Seijin"
        ]
    },
    {
        "id": 59,
        "title": "Akujiki Reijou to Kyouketsu Koushaku",
        "img": "akujiki.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Cocina",
            "Comedia",
            "Fantasía",
            "Romance",
            "Shōjo"
        ],
        "lastUpdate": 1768678905514,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "akujiki1.jpg",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Pass the Monster Meat, Milady!"
        ]
    },
    {
        "id": 60,
        "title": "Saigo ni Hitotsu dake Onegai shitemo Yoroshii deshou ka",
        "aliases": [
            "May I Ask for One Final Thing?"
        ],
        "img": "saigo ni hitotsu.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Fantasía",
            "Comedia",
            "Drama",
            "Romance",
            "Shōjo"
        ]
    },
    {
        "id": 61,
        "title": "Ataque a los titanes",
        "img": "synt.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Misterio",
            "Shōnen"
        ],
        "aliases": [
            "Attack on Titan",
            "Shingeki no Kyojin"
        ]
    },
    {
        "id": 62,
        "title": "Record of Ragnarok",
        "aliases": [
            "Shūmatsu no Valkyrie"
        ],
        "img": "recordpor.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Fantasía",
            "Sobrenatural",
            "Drama",
            "Mitología",
            "Survival",
            "Seinen"
        ]
    },
    {
        "id": 63,
        "title": "Genshin Impact Hentai",
        "aliases": [
            "Hentai"
        ],
        "img": "gih.avif",
        "rating": 5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Fantasía",
            "Tentáculos",
            "Seijin"
        ]
    },
    {
        "id": 64,
        "title": "Gnosia",
        "img": "gnosiap.avif",
        "rating": 4.4,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Ciencia ficción",
            "Deducción Social",
            "Drama",
            "Misterio",
            "Seinen"
        ],
        "lastUpdate": 1775325492328,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "gnosia1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 21",
        "isFinal": true
    },
    {
        "id": 65,
        "title": "Classroom of the Elite",
        "aliases": [
            "Yōkoso Jitsuryoku Shijō Shugi no Kyōshitsu e"
        ],
        "img": "classroomelite.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Drama",
            "Slice of Life",
            "Survival Game",
            "Thriller",
            "Thriller psicológico",
            "Escolar",
            "Seinen"
        ]
    },
    {
        "id": 66,
        "title": "Frieren: Más allá del final del viaje",
        "img": "ff.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Drama",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1775837027184,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/68met98fq4br4u8cd7594/frieren2.avif?rlkey=w5jv3dne0ffs2ponw3ai1kgt0&st=uqyu2mmm&raw=1",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 9",
        "isFinal": false,
        "aliases": [
            "Sōsō no Frieren"
        ]
    },
    {
        "id": 67,
        "title": "Solo leveling",
        "aliases": [
            "Ore dake Level Up na Ken"
        ],
        "img": "sololeveling.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Aventura",
            "Acción",
            "RPG",
            "Superhéroes",
            "Isekai",
            "Nekketsu",
            "Shōnen"
        ]
    },
    {
        "id": 68,
        "title": "It - Bienvenidos a Derry",
        "aliases": [
            "It - Welcome to Derry"
        ],
        "img": "it.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Terror",
            "Sobrenatural",
            "Suspenso",
            "Drama",
            "Thriller",
            "Seijin"
        ]
    },
    {
        "id": 69,
        "title": "Cars",
        "aliases": [
            "Rayo McQueen"
        ],
        "img": "cars.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Infantil",
            "Familiar",
            "Aventura",
            "Animación",
            "Comedia",
            "Acción",
            "Road Movie",
            "Deportivo",
            "Kodomo"
        ]
    },
    {
        "id": 70,
        "title": "Kimi to Koete Koi ni Naru",
        "img": "kimitokoete.avif",
        "rating": 4.3,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Escolar",
            "Fantasía",
            "Romance",
            "Slice of Life",
            "Shōjo"
        ],
        "lastUpdate": 1770243238332,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "kimitokoete1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "With You, Our Love Will Make It Through"
        ]
    },
    {
        "id": 71,
        "title": "Overlord",
        "img": "overlord.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Comedia oscura",
            "Fantasía oscura",
            "Isekai",
            "Sobrenatural",
            "Shōnen"
        ]
    },
    {
        "id": 72,
        "title": "Seihantai na Kimi to Boku",
        "img": "https://www.dropbox.com/scl/fi/tj525d996dhx67ybfo85f/ImageToStl.com_MV5BNGI4NzhiZmMtNWY2Mi00MTFhLTgyOTktZTk1YjRlZmU5NzkxXkEyXkFqcGc._V1_FMjpg_UX1000.avif?rlkey=3so7gb70li05txtrk86ppisen&st=thjnvset&raw=1",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1776003365861,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/87mra8kmnrk51w9uxoxc2/ImageToStl.com_v3_top_fv_kv02.avif?rlkey=yjbztlp5l7fjxsjuke5ffijf3&st=0iob3l2k&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
        "aliases": [
            "You And I Are Polar Opposites"
        ]
    },
    {
        "id": 73,
        "title": "Sentenced to Be a Hero",
        "img": "https://www.dropbox.com/scl/fi/xfnznn3sp5r6ffzkbfadj/ImageToStl.com_fgdfgfdg.avif?rlkey=89wcv2sq8ro8lwpxmd1umh3ce&st=7acedkk4&raw=1",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Fantasía oscura",
            "Seinen"
        ],
        "lastUpdate": 1774824570775,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/g6gmcpr341z0eav70s8xa/C2P4K6XQ5BBNBAKHMAM5XBFAKE.avif?rlkey=8q1u5gev6iq55ndsts7m6s5ij&st=x46rl6r1&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
        "aliases": [
            "Yuusha-kei ni Shosu"
        ]
    },
    {
        "id": 74,
        "title": "SHIBOYUGI: Me gano el pan participando de juegos mortales",
        "img": "https://www.dropbox.com/scl/fi/fx5zw1358e8zykeh8qku1/ImageToStl.com_MV5BMzVmOTUyMTktZjg1ZC00ZjljLWE3MjEtNTRjMDc2Yjg1NzZiXkEyXkFqcGc._V1_-1.avif?rlkey=ejl6szzppyol14lq9nvcjgw4m&st=ipj0pclp&raw=1",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Misterio",
            "Psicológico",
            "Survival",
            "Thriller",
            "Seinen"
        ],
        "lastUpdate": 1773968239416,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/lxizxk8vjgtw98rlqs0gs/ImageToStl.com_MV5BMjhjNDQwYzEtY2EzNy00Zjk2LThmMjgtNGI2ODdlZDAxYzllXkEyXkFqcGc-._V1.avif?rlkey=evoiqoezadb87f7hqfqufabvg&st=qfm4dc84&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": true,
        "aliases": [
            "Shibou Yuugi de Meshi wo Kuu"
        ]
    },
    {
        "id": 75,
        "title": "Date a Live",
        "img": "https://www.dropbox.com/scl/fi/0p0mfy5af83b1u0au9ebb/datealive-1.jpg?rlkey=6cft8w0ibv4j60iqcz4bdip00&st=4i66ch8r&raw=1",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Comedia",
            "Drama",
            "Fantasía",
            "Harem",
            "Romance",
            "Shōnen"
        ],
        "lastUpdate": 1768713497317,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/twsfyhd59flqcld6hx8kf/datealive5.avif?rlkey=szzmialnfoz4pvtbb0ee84bvg&st=uptlajf8&raw=1",
        "latestBlockName": "Temporada 5",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 76,
        "title": "Let's Play",
        "img": "https://www.dropbox.com/scl/fi/p8ym5q7jf3n25bh2x2aok/letsplay.avif?rlkey=byvltt6ghhpit0mutgbogn9qi&st=j3sx3sfp&raw=1",
        "rating": 4.2,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1768753115346,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/hy1r4mrzb32etx0b34i65/letsplay1.avif?rlkey=ium82ha2azfcozjljkipa7iwi&st=0tdmrzz8&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 77,
        "title": "Fire Force",
        "img": "https://www.dropbox.com/scl/fi/yb4ceq87w77dc9tfv6hck/fireforce.avif?rlkey=vqtcwroglk2w1xksclu3fzy6k&st=x4wng0o2&raw=1",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Comedia",
            "Drama",
            "Fantasía",
            "Misterio",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1775243266221,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1vev0mnfqzgdkb64yehck/fireforce3.avif?rlkey=26ytp6sdp69ilxsr5wcxwifah&st=rnme9z8u&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 25",
        "isFinal": true
    },
    {
        "id": 78,
        "title": "Hana-Kimi",
        "img": "https://www.dropbox.com/scl/fi/pjimk877gp2f1gq1fur0f/ImageToStl.com_Hana-Kimi-1.avif?rlkey=e0wi3l2w6v5vjy753cyag3sup&st=89tv9fxr&raw=1",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōjo"
        ],
        "lastUpdate": 1773619004385,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/e5dwv24trzd8zpcexo20i/asfafsaf.avif?rlkey=3jjrm0xy6q0xui8e6cwrgqs0e&st=xhbepgng&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Hanazakari no kimitachi e"
        ]
    },
    {
        "id": 79,
        "title": "Dark Moon: The Blood Altar",
        "img": "https://www.dropbox.com/scl/fi/ypv720n8l5jvhd47c77ei/68HcRvCpiajsPhKn1MnV4hqeCAN.avif?rlkey=yulou1xyoa1ocvhu9nd0pfjxk&st=cswxzs4u&raw=1",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Escolar",
            "Fantasía oscura",
            "Misterio",
            "Reverse Harem",
            "Romance",
            "Sobrenatural",
            "Shōjo"
        ],
        "lastUpdate": 1774643494613,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/2ji05um3swkxlqysdr70h/ImageToStl.com_Airbrush-IMAGE-ENHANCER-1768945509924-1768945509924.avif?rlkey=5cvtzsgy67fktx4om4qrphlco&st=ue9uf0aq&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 80,
        "title": "Hell's Paradise",
        "img": "https://www.dropbox.com/scl/fi/vpt0m3tswyu0uzjsu7f1w/ImageToStl.com_Airbrush-IMAGE-ENHANCER-1769090129026-1769090129026-1.avif?rlkey=4s8i5bmu32nk7mbghl593q6h0&st=1349sffw&raw=1",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía oscura",
            "Histórico",
            "Sobrenatural",
            "Suspenso",
            "Terror",
            "Thriller",
            "Shōnen"
        ],
        "lastUpdate": 1776040313758,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZz2Pl5ZtIRJpcwNxr5Alrpg7RDymX4RfcJV&size=2000x3000",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
        "aliases": [
            "Jigokuraku."
        ]
    },
    {
        "id": 81,
        "title": "NieR: Automata Ver1.1a",
        "img": "https://www.dropbox.com/scl/fi/54c7obrwsgh12oojlpvkx/ImageToStl.com_Airbrush-IMAGE-ENHANCER-1769098432658-1769098432658-1.avif?rlkey=md3jxz8n24z6i6ube8locfa9o&st=1kc4iygy&raw=1",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Drama",
            "Post-apocalíptico",
            "Psicológico",
            "Seinen"
        ],
        "lastUpdate": 1769105148079,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/8r1nblzvbi56izp0v7kog/ImageToStl.com_sadfsf.avif?rlkey=dqr0neuyaiwp4tnhc9t8e2jcf&st=2ij9738d&raw=1",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Automata"
        ]
    },
    {
        "id": 82,
        "title": "TSUKIMICHI -Moonlit Fantasy-",
        "img": "https://www.dropbox.com/scl/fi/e56h2qp9qlauoosf1h7hk/ImageToStl.com_1726486-1.avif?rlkey=ib1bvbj4pprxe9kvqcado5n9e&st=y5m4yxqn&raw=1",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Comedia",
            "Fantasía",
            "Harem",
            "Isekai",
            "Shōnen"
        ],
        "lastUpdate": 1769140612459,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/v8bqukkk1hnrttxesdelv/aSdasd.avif?rlkey=6mvurri42mf2tl9vzjq7akzj9&st=3pyfls2p&raw=1",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 25",
        "isFinal": true,
        "aliases": [
            "Tsuki ga Michibiku Isekai Dōchū"
        ]
    },
    {
        "id": 83,
        "title": "Mairimashita! Iruma-kun",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/iruma.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Fantasía",
            "Isekai",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1775919995565,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/iruma4.avif",
        "latestBlockName": "Temporada 4",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "Welcome to Demon School! Iruma-kun"
        ]
    },
    {
        "id": 84,
        "title": "Kobayashi-san Chi no Maid Dragon",
        "img": "https://api.pcloud.com/getpubthumb?code=XZ4jhK5ZV96vwk3dhrfuqylIjMK0SkhV0pyV&size=2000x3000",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Fantasía",
            "Isekai Inverso",
            "Romance",
            "Slice of Life",
            "Yuri",
            "Seinen"
        ],
        "lastUpdate": 1769785876713,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZjojK5Z0gt6QP9JFsB8waiQNJy5hFX2fF77&size=2000x3000",
        "latestBlockName": "Película 1",
        "latestEpTitle": "A Lonely Dragon Wants to Be Loved",
        "isFinal": true,
        "aliases": [
            "Miss Kobayashi’s Dragon Maid"
        ]
    },
    {
        "id": 85,
        "title": "Sword Art Online",
        "img": "https://api.pcloud.com/getpubthumb?code=XZexDK5ZF3sDn1qITuYL1VScYcuknLSBUcDy&size=2000x3000",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Fantasía",
            "Isekai",
            "Romance",
            "Thriller",
            "VRMMO",
            "Shōnen"
        ],
        "lastUpdate": 1769805090130,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZr1TK5ZWqGs6z8IT6JzKyMNjMbUSH5P9wOk&size=2000x3000",
        "latestBlockName": "Alternative: Gun Gale Online II",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 86,
        "title": "Baki",
        "img": "https://api.pcloud.com/getpubthumb?code=XZ0p9K5Zz7CYJaaP8E4a4o9sBzCkrSwHI6k0&size=2000x3000",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Artes Marciales",
            "Deportivo",
            "Shōnen"
        ],
        "lastUpdate": 1769789195067,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZ6rMK5ZTji8HdOSHVXg8AlDp46GWV3zzusy&size=2000x3000",
        "latestBlockName": "Película 1",
        "latestEpTitle": "Baki Hanma vs. Kengan Ashura",
        "isFinal": false
    },
    {
        "id": 87,
        "title": "Death Note",
        "img": "https://api.pcloud.com/getpubthumb?code=XZC3PK5ZI5e4GKRCk8Xvz6QX7v678Q275LUy&size=2000x3000",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Drama",
            "Misterio",
            "Sobrenatural",
            "Suspenso",
            "Thriller psicológico",
            "Shōnen"
        ],
        "lastUpdate": 1769889152335,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZd3PK5ZpT0OB7y4ALjU5DNn1jo74HFpQ6FV&size=2000x3000",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 37",
        "isFinal": true
    },
    {
        "id": 88,
        "title": "Leviathan",
        "img": "https://api.pcloud.com/getpubthumb?code=XZtUxK5ZfdVT4R2RN44PbPKssJv7pzlVjzTk&size=2000x3000",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Fantasía",
            "Militar",
            "Steampunk",
            "Shōnen"
        ],
        "lastUpdate": 1769958574912,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZUUxK5ZvX1LOxy7ATS77OpaO3KgbbREKVQV&size=2000x3000",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 89,
        "title": "Bocchi the Rock!",
        "img": "https://api.pcloud.com/getpubthumb?code=XZ4dxK5ZKlNdhaL1aIHMTyPcgPwmj0xf5tck&size=2000x3000",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Musical",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1769957459671,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZ2dxK5ZgSR67lxGIR7csx2hXKyFnYeBg4M7&size=2000x3000",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 90,
        "title": "Shangri-La Frontier",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/shangiran.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Fantasía",
            "VRMMO",
            "Shōnen"
        ],
        "lastUpdate": 1773758461313,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZBEwK5ZjV7AT4DkE4YjShvLSJIRlLcMFJHV&size=2000x3000",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 25",
        "isFinal": true
    },
    {
        "id": 91,
        "title": "Trigun Stampede",
        "img": "https://api.pcloud.com/getpubthumb?code=XZswdK5ZPrDr8metTShLGWYpHJjgnJ3OvO3k&size=2000x3000",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Drama",
            "Seinen"
        ],
        "lastUpdate": 1775934757120,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/trigun-stargaze-character-visuals-v0-no7rngaincuf1.jpg",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false
    },
    {
        "id": 92,
        "title": "Roll Over and Die",
        "img": "https://api.pcloud.com/getpubthumb?code=XZppEK5ZRLLOpgFR0DXqgYFQHwIxaYtakxkk&size=2000x3000",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía oscura",
            "Romance",
            "Survival",
            "Yuri",
            "Shōnen"
        ],
        "lastUpdate": 1775773593071,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZHpEK5ZDYj1Ggi9U8bycVPaNOxCkQolhpak&size=2000x3000",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
        "aliases": [
            "Omae Gotoki ga Maō ni Kateru to Omou na"
        ]
    },
    {
        "id": 93,
        "title": "Tower of God",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/tower.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Misterio",
            "Shōnen"
        ],
        "lastUpdate": 1773758499527,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZR6EK5ZMbtpcgy8H3Ld11AsXGK1V5mXHjRk&size=2000x3000",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 26",
        "isFinal": true,
        "aliases": [
            "Torre de Dios"
        ]
    },
    {
        "id": 94,
        "title": "Oshi no Ko",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ImageToStl.com_oshi.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Drama",
            "Misterio",
            "Slice of Life",
            "Sobrenatural",
            "Thriller psicológico",
            "Seinen"
        ],
        "lastUpdate": 1775694655329,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ImageToStl.com_oshi%2Bt3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 8",
        "isFinal": false
    },
    {
        "id": 95,
        "title": "Rooster Fighter",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/pollo.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Parodia",
            "Post-apocalíptico",
            "Sobrenatural",
            "Seinen"
        ],
        "lastUpdate": 1776003402135,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/pollo1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 5",
        "isFinal": false,
        "aliases": [
            "Niwatori Fighter"
        ]
    },
    {
        "id": 96,
        "title": "Mato Seihei no Slave",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Seihei.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ecchi",
            "Fantasía oscura",
            "Harem",
            "Shōnen"
        ],
        "lastUpdate": 1774367250048,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Seihei1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Chained Soldier"
        ]
    },
    {
        "id": 97,
        "title": "Wind Breaker",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/winder.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Escolar",
            "Yankī",
            "Shōnen"
        ],
        "lastUpdate": 1774214367932,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/winderbt2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 98,
        "title": "Sonic",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/sonic.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Animación",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Fantasía",
            "Familiar",
            "Infantil",
            "Policial",
            "Kodomo"
        ],
        "lastUpdate": 1775144553017,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/sonic4.avif",
        "latestBlockName": "Película 4",
        "latestEpTitle": "Trailer",
        "isFinal": false
    },
    {
        "id": 99,
        "title": "Super Mario Bros",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mariop.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Animación",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Drama",
            "Fantasía",
            "Familiar",
            "Infantil",
            "Romance",
            "Kodomo"
        ],
        "lastUpdate": 1775141427915,
        "updateType": "ESTRENO 🚨",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/mario2.avif",
        "latestBlockName": "Película 2",
        "latestEpTitle": "Película 2 Subtítulos en línea",
        "isFinal": false
    },
    {
        "id": 100,
        "title": "Komi-san wa, Komyushō desu.",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/komisan.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Coming-of-age",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1774461121349,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/komisan2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Komi-san no puede comunicarse"
        ]
    },
    {
        "id": 101,
        "title": "Boku no Kokoro no Yabai Yatsu",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/bokunokokoro.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Coming-of-age",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1774639816966,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/bokunokokoro2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 13",
        "isFinal": false,
        "aliases": [
            "The Dangers in my Heart"
        ]
    },
    {
        "id": 102,
        "title": "El incidente de Darwin",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/darwin.avif",
        "rating": 4.3,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Ciencia ficción",
            "Deducción Social",
            "Drama",
            "Suspenso",
            "Thriller",
            "Seinen"
        ],
        "lastUpdate": 1775054393842,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/darwin1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 13",
        "isFinal": false,
        "aliases": [
            "Darwin Jihen",
            "The Darwin Incident"
        ]
    },
    {
        "id": 103,
        "title": "Horimiya",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/horimiya.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1775058361747,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/horimiya2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Hori-san to Miyamura-kun"
        ]
    },
    {
        "id": 104,
        "title": "Dorohedoro",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/doro.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Ciencia ficción",
            "Fantasía oscura",
            "Horror",
            "Seinen"
        ],
        "lastUpdate": 1775661913405,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/doro2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 4",
        "isFinal": false
    },
    {
        "id": 105,
        "title": "Ganbare! Nakamura-kun!!",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/gambarepor.avif",
        "rating": 4.2,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Yaoi",
            "Shōjo"
        ],
        "lastUpdate": 1775160587272,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ganbare1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "Go For It, Nakamura-kun!!"
        ]
    },
    {
        "id": 106,
        "title": "Rompiendo el hielo",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Rompiendoelhielo.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Coming-of-age",
            "Drama",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōjo"
        ],
        "lastUpdate": 1775773371768,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Rompiendoelhielo1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "Koori no Jouheki",
            "The Ramparts of Ice"
        ]
    },
    {
        "id": 107,
        "title": "Snowball Earth",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/snowball.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Kaiju",
            "Mecha",
            "Post-apocalíptico",
            "Survival",
            "Seinen"
        ],
        "lastUpdate": 1775868643345,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/snowball1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 108,
        "title": "Rilakkuma",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Rilakkuma.avif",
        "rating": 3.3,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Familiar",
            "Slice of Life",
            "Josei"
        ],
        "lastUpdate": 1775920359031,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Rilakkuma1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 109,
        "title": "Daemons of the Shadow Realm",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/dawmons.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía oscura",
            "Sobrenatural",
            "Shōnen"
        ],
        "lastUpdate": 1775934158301,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/dawmons1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "Yomi no Tsugai"
        ]
    },
    {
        "id": 110,
        "title": "Nippon Sangoku: Las tres naciones del sol carmesí",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Nippon.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Militar",
            "Post-apocalíptico",
            "Seinen"
        ],
        "lastUpdate": 1776040456012,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Nippon1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 111,
        "title": "Witch Hat Atelier",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Atelier%20of%20Witch%20Hat.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Drama",
            "Fantasía",
            "Seinen"
        ],
        "lastUpdate": 1776093798742,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Atelier%20of%20Witch%20Hat1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 3",
        "isFinal": false,
        "aliases": [
            "Atelier of Witch Hat"
        ]
    },
    {
        "id": 112,
        "title": "Scarlet",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/scarlet.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía",
            "Seinen"
        ],
        "lastUpdate": 1775512959643,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/scarlet1.avif",
        "latestBlockName": "Película 1",
        "latestEpTitle": "Película 1",
        "isFinal": false,
        "aliases": [
            "Hateshinaki sukāretto"
        ]
    },
    {
        "id": 113,
        "title": "Blue Box",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/bluebox.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Deportivo",
            "Drama",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Shōnen"
        ],
        "lastUpdate": 1775597679018,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/bluebox1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 25",
        "isFinal": false,
        "aliases": [
            "Ao no Hako",
            "La Caja Azul"
        ]
    },
    {
        "id": 114,
        "title": "The Boys",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/theboys.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Comedia oscura",
            "Drama",
            "Misterio",
            "Policial",
            "Superhéroes",
            "Thriller",
            "Seijin"
        ],
        "lastUpdate": 1775771701508,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/theboys5.avif",
        "latestBlockName": "Temporada 5",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    }
];