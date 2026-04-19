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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/MyDress-UpDarling.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Cosplay",
            "Escolar",
            "Romance",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1776577813138,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/MyDress-UpDarling2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Sono Bisque Doll wa Koi wo Suru"
        ]
    },
    {
        "id": 47,
        "title": "Hazbin Hotel",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/HazbinHotel.avif",
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
        "lastUpdate": 1776577961168,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/HazbinHotel2.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TheEminenceinShadow.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Fantasía",
            "Harem",
            "Isekai",
            "Steampunk",
            "Shōnen"
        ],
        "lastUpdate": 1776578166719,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TheEminenceinShadow2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "Kage no Jitsuryokusha ni Naritakute!"
        ]
    },
    {
        "id": 49,
        "title": "Spy × Family",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/spy-x-family.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Drama",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776578651709,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/spy-x-family3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 13",
        "isFinal": true
    },
    {
        "id": 50,
        "title": "Black Clover",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BlackCover.avif",
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
        "lastUpdate": 1776605683612,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BlackCover4.avif",
        "latestBlockName": "Temporada 1 - Arco IV",
        "latestEpTitle": "Capítulo 16",
        "isFinal": false
    },
    {
        "id": 51,
        "title": "My Hero Academia",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BokuNoHero.avif",
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
        "lastUpdate": 1776605876009,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BokuNoHero1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/KakouNoInazuke.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Escolar",
            "Harem",
            "Romance",
            "Shōnen"
        ],
        "lastUpdate": 1776606107091,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/KakouNoInazuke%202.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false,
        "aliases": [
            "A Couple of Cuckoos"
        ]
    },
    {
        "id": 53,
        "title": "Futari Solo Camp",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/FutariSoloCamp.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Romance",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1776606328974,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/FutariSoloCamp1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Tojima.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Tokusatsu",
            "Seinen"
        ],
        "lastUpdate": 1776606511345,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Tojima1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/almachan.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Ciencia ficción",
            "Comedia",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1776606629184,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/almachan1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
        "aliases": [
            "Alma-chan Wants to Be a Family!"
        ]
    },
    {
        "id": 56,
        "title": "Spice and Wolf",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SpiceandWolf.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Ciencia ficción",
            "Drama",
            "Fantasía",
            "Romance",
            "Seinen"
        ],
        "lastUpdate": 1776606777332,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SpiceandWolf%201.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 25",
        "isFinal": false,
        "aliases": [
            "Okami to Kōshinryō"
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/RickAndMorty.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Animación",
            "Aventura",
            "Ciencia ficción",
            "Comedia",
            "Comedia oscura",
            "Gag",
            "Seijin"
        ],
        "lastUpdate": 1776607021156,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/RickAndMorty8.avif",
        "latestBlockName": "Temporada 8",
        "latestEpTitle": "Capítulo 10",
        "isFinal": false,
        "aliases": [
            "Rick y Morty"
        ]
    },
    {
        "id": 59,
        "title": "Akujiki Reijou to Kyouketsu Koushaku",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/akujiki.avif",
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
        "lastUpdate": 1776607202592,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/akujiki1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SaigoNiHitotsu.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Comedia",
            "Drama",
            "Fantasía",
            "Romance",
            "Shōjo"
        ],
        "lastUpdate": 1776607544787,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SaigoNiHitotsu1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 13",
        "isFinal": false,
        "aliases": [
            "May I Ask for One Final Thing?"
        ]
    },
    {
        "id": 61,
        "title": "Ataque a los titanes",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/AttackOnTitan.avif",
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
        "lastUpdate": 1776607886434,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/AttackOnTitan4.avif",
        "latestBlockName": "Temporada 4",
        "latestEpTitle": "Capítulo 30",
        "isFinal": false,
        "aliases": [
            "Attack on Titan",
            "Shingeki no Kyojin"
        ]
    },
    {
        "id": 62,
        "title": "Record of Ragnarok",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/RecordOfRagnarok.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Fantasía",
            "Mitología",
            "Sobrenatural",
            "Survival",
            "Seinen"
        ],
        "lastUpdate": 1776608515558,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/RecordOfRagnarok3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 15",
        "isFinal": false,
        "aliases": [
            "Shūmatsu no Valkyrie"
        ]
    },
    {
        "id": 63,
        "title": "Genshin Impact Hentai",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ImpactG.avif",
        "rating": 5,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Fantasía",
            "Hentai",
            "Tentáculos",
            "Seijin"
        ],
        "lastUpdate": 1776608719839,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/ImpactG1.avif",
        "latestBlockName": "Videos",
        "latestEpTitle": "Capítulo 20",
        "isFinal": false,
        "aliases": [
            "Hentai"
        ]
    },
    {
        "id": 64,
        "title": "Gnosia",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Gnosia.avif",
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
        "lastUpdate": 1776608826587,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Gnosia1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 21",
        "isFinal": true
    },
    {
        "id": 65,
        "title": "Classroom of the Elite",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/classroomelite.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Drama",
            "Escolar",
            "Slice of Life",
            "Survival Game",
            "Thriller",
            "Thriller psicológico",
            "Seinen"
        ],
        "lastUpdate": 1776608963282,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/classroomelite3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 13",
        "isFinal": false,
        "aliases": [
            "Yōkoso Jitsuryoku Shijō Shugi no Kyōshitsu e"
        ]
    },
    {
        "id": 66,
        "title": "Frieren: Más allá del final del viaje",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Frieren.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Aventura",
            "Drama",
            "Fantasía",
            "Shōnen"
        ],
        "lastUpdate": 1776609080985,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Frieren2.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SoloLeveling.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía",
            "Isekai",
            "Nekketsu",
            "RPG",
            "Superhéroes",
            "Shōnen"
        ],
        "lastUpdate": 1776609187165,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SoloLeveling2.avif",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 13",
        "isFinal": false,
        "aliases": [
            "Ore dake Level Up na Ken"
        ]
    },
    {
        "id": 68,
        "title": "It - Bienvenidos a Derry",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/it.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Drama",
            "Sobrenatural",
            "Suspenso",
            "Terror",
            "Thriller",
            "Seijin"
        ],
        "lastUpdate": 1776609278046,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/it1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 8",
        "isFinal": false,
        "aliases": [
            "It - Welcome to Derry"
        ]
    },
    {
        "id": 69,
        "title": "Cars",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/cars.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Animación",
            "Aventura",
            "Comedia",
            "Deportivo",
            "Familiar",
            "Infantil",
            "Kodomo"
        ],
        "lastUpdate": 1776609385870,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/cars3.avif",
        "latestBlockName": "Película 3",
        "latestEpTitle": "Película 3",
        "isFinal": false,
        "aliases": [
            "Rayo McQueen"
        ]
    },
    {
        "id": 70,
        "title": "Kimi to Koete Koi ni Naru",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kimitokoete.avif",
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
        "lastUpdate": 1776609477675,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/kimitokoete1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/overlord.avif",
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
        ],
        "lastUpdate": 1776609638119,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/overlordp.avif",
        "latestBlockName": "Película 1",
        "latestEpTitle": "El Reino Sagrado",
        "isFinal": false
    },
    {
        "id": 72,
        "title": "Seihantai na Kimi to Boku",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SeihantaiNaKimi.avif",
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
        "lastUpdate": 1776609788041,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SeihantaiNaKimi%201.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SentencedToBeA%20Hero3.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Fantasía oscura",
            "Seinen"
        ],
        "lastUpdate": 1776610232176,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SentencedToBeA%20Hero2.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Shiboyugi.avif",
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
        "lastUpdate": 1776610520863,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Shiboyugi1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DateALice.avif",
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
        "lastUpdate": 1776611367618,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DateALice5.avif",
        "latestBlockName": "Temporada 5",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 76,
        "title": "Let's Play",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/LetsPlay.avif",
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
        "lastUpdate": 1776611539217,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/LetsPlay1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 77,
        "title": "Fire Force",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/fireforce.avif",
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
        "lastUpdate": 1776611686139,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/fireforce3.avif",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 25",
        "isFinal": true
    },
    {
        "id": 78,
        "title": "Hana-Kimi",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Hana-Kimi.avif",
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
        "lastUpdate": 1776611814710,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Hana-Kimi1.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DarkMoon.avif",
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
        "lastUpdate": 1776612253425,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DarkMoon1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 80,
        "title": "Hell's Paradise",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/HellParadire.avif",
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
        "lastUpdate": 1776612417979,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/HellParadire2.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/NieRAutomata.avif",
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
        "lastUpdate": 1776612619128,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/NieRAutomata2.avif",
        "latestBlockName": "Temporada 1 - Parte II",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true,
        "aliases": [
            "Automata"
        ]
    },
    {
        "id": 82,
        "title": "TSUKIMICHI -Moonlit Fantasy-",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TsukiGaMichibiku.avif",
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
        "lastUpdate": 1776612754839,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/TsukiGaMichibiku2.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Kobayashis.avif",
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
        "lastUpdate": 1776612972666,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Kobayashis_pelicula.avif",
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
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SwordArtOnline.avif",
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
        "lastUpdate": 1776613443125,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/SwordArtOnline_alternative2.avif",
        "latestBlockName": "Alternative: Gun Gale Online II",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 86,
        "title": "Baki",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Baki.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Artes Marciales",
            "Deportivo",
            "Shōnen"
        ],
        "lastUpdate": 1776614591106,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Baki_pelicula.avif",
        "latestBlockName": "Película 1",
        "latestEpTitle": "Baki Hanma vs. Kengan Ashura",
        "isFinal": false
    },
    {
        "id": 87,
        "title": "Death Note",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DeadNote.avif",
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
        "lastUpdate": 1776614917067,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/DeadNote1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 37",
        "isFinal": true
    },
    {
        "id": 88,
        "title": "Leviathan",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Leviathan.avif",
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
        "lastUpdate": 1776615090254,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/Leviathan1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": true
    },
    {
        "id": 89,
        "title": "Bocchi the Rock!",
        "img": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BochiTheRock.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Comedia",
            "Musical",
            "Slice of Life",
            "Seinen"
        ],
        "lastUpdate": 1776615267042,
        "updateType": "Ninguna",
        "latestSeasonCover": "https://cdn.jsdelivr.net/gh/Archinime/imagenes@main/BochiTheRock1.avif",
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