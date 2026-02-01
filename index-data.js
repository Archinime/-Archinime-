const animes = [
    {
        "id": 1,
        "title": "DAN DA DAN",
        "img": "dan.avif",
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
        "lastUpdate": 1768745863080,
        "updateType": "Ninguna",
        "latestSeasonCover": "dan2.jpg",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
    },
    {
        "id": 2,
        "title": "Jujutsu Kaisen",
        "img": "Jujutsu.avif",
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
        "lastUpdate": 1769805217118,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/fsaecbkjhqot7rnqy2lnl/sfsf.avif?rlkey=xg05r2gx62t7jn2z5m9q47ehm&st=5azi7pqp&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false
    },
    {
        "id": 3,
        "title": "Konosuba",
        "img": "konosubaportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Comedia",
            "Fantasía",
            "Sobrenatural",
            "Isekai",
            "Ecchi",
            "Shōnen"
        ]
    },
    {
        "id": 4,
        "title": "Re:Zero − Empezar vida en otro mundo",
        "img": "rezero.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Romance",
            "Thriller psicológico",
            "Terror psicológico",
            "Isekai",
            "Shōnen"
        ]
    },
    {
        "id": 5,
        "title": "Mushoku Tensei",
        "img": "mushoku.avif",
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
        "lastUpdate": 1768680725366,
        "updateType": "Ninguna",
        "latestSeasonCover": "mushoku22.jpg",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false
    },
    {
        "id": 6,
        "title": "Tensei Shitara Slime Datta Ken",
        "img": "slime.avif",
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
        "lastUpdate": 1769090734634,
        "updateType": "Ninguna",
        "latestSeasonCover": "tensura3.jpg",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 24",
        "isFinal": false,
        "aliases": [
            "That Time I Got Reincarnated as a Slime"
        ]
    },
    {
        "id": 7,
        "title": "Saga of Tanya the Evil",
        "aliases": [
            "Yōjo Senki"
        ],
        "img": "tanya1.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Aventura",
            "Fantasía",
            "Militar",
            "Drama",
            "Ciencia ficción",
            "Seinen"
        ]
    },
    {
        "id": 8,
        "title": "Akame Ga Kill",
        "aliases": [
            "Akame ga Kiru"
        ],
        "img": "Akame1.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Aventura",
            "Drama",
            "Fantasía oscura",
            "Romance",
            "Tragedia",
            "Shōnen"
        ]
    },
    {
        "id": 9,
        "title": "To Be Hero X",
        "img": "hero11.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Comedia",
            "Animación",
            "Fantasía",
            "Superhéroes",
            "Seinen"
        ]
    },
    {
        "id": 10,
        "title": "Demon Slayer",
        "img": "demon.avif",
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
        "aliases": [
            "Kimetsu no Yaiba"
        ]
    },
    {
        "id": 11,
        "title": "Maou 2099",
        "img": "maou2099portada.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Ciencia ficción",
            "Isekai Inverso",
            "Acción",
            "Fantasía",
            "Cyberpunk",
            "Shōnen"
        ]
    },
    {
        "id": 12,
        "title": "Wistoria: Wand and Sword",
        "img": "wistoria.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Aventura",
            "Shōnen"
        ]
    },
    {
        "id": 13,
        "title": "Izure Saikyou no Renkinjutsushi",
        "aliases": [
            "Possibly the Greatest Alchemist of All Time"
        ],
        "img": "Izure.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Comedia",
            "Fantasía",
            "Isekai",
            "Shōnen"
        ]
    },
    {
        "id": 14,
        "title": "Alya Sometimes Hides Her Feelings in Russian",
        "aliases": [
            "Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san"
        ],
        "img": "alia.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Romance",
            "Escolar",
            "Josei"
        ]
    },
    {
        "id": 15,
        "title": "Reborn as a Vending Machine, I Now Wander the Dungeon",
        "aliases": [
            "Jidōhanbaiki ni Umarekawatta Ore wa Meikyū ni Samayō"
        ],
        "img": "jidou.avif",
        "rating": 4.1,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Isekai",
            "Shōnen"
        ]
    },
    {
        "id": 16,
        "title": "kimi to boku no saigo no senjou",
        "aliases": [
            "Our Last Crusade or the Rise of a New World"
        ],
        "img": "kimi22222.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Fantasía",
            "Romance",
            "Militar",
            "Seinen"
        ]
    },
    {
        "id": 17,
        "title": "The Gorilla God's Go- To Girl",
        "aliases": [
            "Gorilla no Kami Kara Kago Sareta Reijō wa Ōritsu Kishidan de Kawaiigareru"
        ],
        "img": "gorila11.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Comedia",
            "Escolar",
            "Romance",
            "Shōjo"
        ]
    },
    {
        "id": 18,
        "title": "Chainsaw Man",
        "img": "chaiportada.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía oscura",
            "Acción",
            "Comedia oscura",
            "Shōnen"
        ]
    },
    {
        "id": 19,
        "title": "The Rising of the Shield Hero",
        "aliases": [
            "Tate no Yuusha no Nariagari",
            "El Héroe del Escudo"
        ],
        "img": "heroedelescudoportada.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Drama",
            "Fantasía",
            "Acción",
            "Romance",
            "Isekai",
            "Seinen"
        ]
    },
    {
        "id": 20,
        "title": "Overflow",
        "img": "overflow.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Escolar",
            "Romance",
            "Harem",
            "Incesto",
            "Seijin"
        ]
    },
    {
        "id": 21,
        "title": "Shiunji-ke no Kodomotachi",
        "img": "Shiux.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Romance",
            "Drama",
            "Harem",
            "Slice of Life",
            "Seinen"
        ]
    },
    {
        "id": 22,
        "title": "Goblin Slayer",
        "img": "goblinslayerportada.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía oscura",
            "Horror",
            "Aventura",
            "Fantasía",
            "Seinen"
        ]
    },
    {
        "id": 23,
        "title": "Kanchigai no Atelier Meister",
        "img": "atelier1.avif",
        "rating": 4.6,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Comedia",
            "Fantasía",
            "Acción",
            "Shōnen"
        ]
    },
    {
        "id": 24,
        "title": "Definitivamente. ¡No me gusta mi hermano para nada!",
        "img": "Oni.avif",
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
        "lastUpdate": 1768622729150,
        "updateType": "ACTUALIZACIÓN 🛠️",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1ds4mocfv035zgs7brobv/Definitivamente1.jpg?rlkey=xurw5jdgzeeww66ly0vmhiy6k&st=o8jyfz4c&raw=1",
        "latestBlockName": "Ova 1",
        "latestEpTitle": "Capítulo 1"
    },
    {
        "id": 25,
        "title": "Kaiju No. 8",
        "img": "kaijuportada.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Sobrenatural",
            "Fantasía oscura",
            "Acción",
            "Ciencia ficción",
            "Aventura",
            "Comedia",
            "Kaiju",
            "Shōnen"
        ]
    },
    {
        "id": 26,
        "title": "Zootopia",
        "img": "zootopiaportada.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Comedia",
            "Policial",
            "Infantil",
            "Familiar",
            "Misterio",
            "Animación",
            "Dibujo Animado",
            "Kodomo"
        ]
    },
    {
        "id": 27,
        "title": "Clevatess -Majuu no Ou to Akago",
        "img": "Clevatessportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Fantasía",
            "Drama",
            "Seinen"
        ]
    },
    {
        "id": 28,
        "title": "Dr. Stone",
        "img": "Dr._Stoneportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Ciencia ficción",
            "Aventura",
            "Comedia",
            "Divulgación Científica",
            "Post-apocalíptico",
            "Shōnen"
        ]
    },
    {
        "id": 29,
        "title": "One Piece (Live Action)",
        "img": "onepieceportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Aventura",
            "Comedia",
            "Acción",
            "Fantasía",
            "Drama",
            "Shōnen"
        ]
    },
    {
        "id": 30,
        "title": "Shoujo Ramune",
        "img": "shoujoramuneportada.avif",
        "rating": 4.3,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Harem",
            "Incesto",
            "Seijin"
        ]
    },
    {
        "id": 31,
        "title": "To Your Eternity",
        "img": "fumetsuportada.avif",
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
        "lastUpdate": 1769890296167,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/2zghbbzs6lpi2lt6sf7ui/fumetsu3.jpg?rlkey=l8yfxc0yk2u13ie8wemgcuoal&st=t0qoyl96&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 16",
        "isFinal": false,
        "aliases": [
            "Fumetsu no Anata e"
        ]
    },
    {
        "id": 32,
        "title": "Tsugunai Subbed",
        "img": "TsugunaiSubbed.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Harem",
            "Escolar",
            "Seijin"
        ]
    },
    {
        "id": 33,
        "title": "Blue Lock",
        "aliases": [
            "Yoichi Isagi"
        ],
        "img": "Bluelockportada.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Thriller",
            "Psicológico",
            "Deportivo",
            "Survival Game",
            "Shōnen"
        ]
    },
    {
        "id": 34,
        "title": "Magic Maker: Isekai Mahou no Tsukurikata",
        "aliases": [
            "Magic Maker: How to Make Magic in Another World"
        ],
        "img": "magic maker.avif",
        "rating": 4.4,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Isekai",
            "Aventura",
            "Slice of Life",
            "Shōnen"
        ]
    },
    {
        "id": 35,
        "title": "Tsuyokute New Saga",
        "aliases": [
            "New Saga"
        ],
        "img": "New Saga.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Isekai",
            "Aventura",
            "Comedia",
            "Acción",
            "Drama",
            "Slice of Life",
            "Shōnen"
        ]
    },
    {
        "id": 36,
        "title": "Gachiakuta",
        "img": "Gachiakuta.avif",
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
        "lastUpdate": 1768672095349,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/xlkbrayxyel3kiyepr1r2/Gachiakuta1.jpg?rlkey=q5g6jlo0cv4e5z7znj70vtyor&st=uh2bwp30&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 24"
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
        "aliases": [
            "By the Grace of the Gods"
        ],
        "img": "Kamitachi.avif",
        "rating": 4.7,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Aventura",
            "Slice of Life",
            "Isekai",
            "Shōnen"
        ]
    },
    {
        "id": 39,
        "title": "Ore dake Haireru Kakushi Dungeon",
        "aliases": [
            "The Hidden Dungeon Only I Can Enter"
        ],
        "img": "oredake.avif",
        "rating": 4.5,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Comedia",
            "Harem",
            "Ecchi",
            "Acción",
            "Romance",
            "Shōnen"
        ]
    },
    {
        "id": 40,
        "title": "One Punch-Man",
        "img": "onepunch.avif",
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
        "lastUpdate": 1769402807866,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1r0djgkxmptdfe2ltkbk1/onepunch3.jpg?rlkey=4e2i0r1cvl5ufsh5f41fa2sqm&st=woghk9gy&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 9",
        "isFinal": false,
        "aliases": [
            "One-Punch Man"
        ]
    },
    {
        "id": 41,
        "title": "Mashle",
        "aliases": [
            "Mash Burnedead"
        ],
        "img": "mashle1.avif",
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
        "id": 42,
        "title": "Los Diarios de la Boticaria",
        "aliases": [
            "Kusuriya no Hitorigoto",
            "The Apothecary Diaries"
        ],
        "img": "maomaot1.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Drama",
            "Misterio",
            "Romance",
            "Shōjo"
        ]
    },
    {
        "id": 43,
        "title": "Maplestar",
        "img": "pm.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Animación",
            "Seijin"
        ]
    },
    {
        "id": 44,
        "title": "Uzumaki",
        "img": "uzumakii.avif",
        "rating": 4.2,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Horror",
            "Seinen"
        ]
    },
    {
        "id": 45,
        "title": "Tondemo Skill de Isekai Hourou Meshi",
        "aliases": [
            "Campfire Cooking in Another World with My Absurd Skills"
        ],
        "img": "todemo.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Fantasía",
            "Slice of Life",
            "Cocina",
            "Aventura",
            "Shōnen",
            "Isekai"
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
        "title": "Tōjima Tanzaburō wa Kamen Rider ni Naritai",
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
        "lastUpdate": 1769889644015,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1acwpuwtsx2f20urv44eo/Airbrush-IMAGE-ENHANCER-1763730194883-1763730194884.jpg?rlkey=ornue772yaoazcagrsinqj1fc&st=nlz517kl&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 14",
        "isFinal": false,
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
        "img": "oyasumi.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Hentai",
            "Romance",
            "Slice of Life",
            "Seijin"
        ]
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
        "lastUpdate": 1768945911848,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "gnosia1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 12",
        "isFinal": false
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
        "lastUpdate": 1769090494470,
        "updateType": "ESTRENO 🚨",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/68met98fq4br4u8cd7594/frieren2.avif?rlkey=w5jv3dne0ffs2ponw3ai1kgt0&st=uqyu2mmm&raw=1",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 1",
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
        "lastUpdate": 1769735432170,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "kimitokoete1.avif",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 11",
        "isFinal": false,
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
        "lastUpdate": 1768944384687,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/87mra8kmnrk51w9uxoxc2/ImageToStl.com_v3_top_fv_kv02.avif?rlkey=yjbztlp5l7fjxsjuke5ffijf3&st=0iob3l2k&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 2",
        "isFinal": false,
        "aliases": [
            "You And I Are Polar Opposites"
        ]
    },
    {
        "id": 73,
        "title": "Sentenced to Be a Hero",
        "img": "https://www.dropbox.com/scl/fi/xfnznn3sp5r6ffzkbfadj/ImageToStl.com_fgdfgfdg.avif?rlkey=89wcv2sq8ro8lwpxmd1umh3ce&st=7acedkk4&raw=1",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "uploaderImg": "Logo_Archinime.avif",
        "genres": [
            "Acción",
            "Drama",
            "Fantasía oscura",
            "Seinen"
        ],
        "lastUpdate": 1769801713891,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/g6gmcpr341z0eav70s8xa/C2P4K6XQ5BBNBAKHMAM5XBFAKE.avif?rlkey=8q1u5gev6iq55ndsts7m6s5ij&st=x46rl6r1&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 4",
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
        "lastUpdate": 1769735367777,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/lxizxk8vjgtw98rlqs0gs/ImageToStl.com_MV5BMjhjNDQwYzEtY2EzNy00Zjk2LThmMjgtNGI2ODdlZDAxYzllXkEyXkFqcGc-._V1.avif?rlkey=evoiqoezadb87f7hqfqufabvg&st=qfm4dc84&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 4",
        "isFinal": false,
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
        "lastUpdate": 1769444437314,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/1vev0mnfqzgdkb64yehck/fireforce3.avif?rlkey=26ytp6sdp69ilxsr5wcxwifah&st=rnme9z8u&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 15",
        "isFinal": false
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
        "lastUpdate": 1769444192195,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/e5dwv24trzd8zpcexo20i/asfafsaf.avif?rlkey=3jjrm0xy6q0xui8e6cwrgqs0e&st=xhbepgng&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 5",
        "isFinal": false,
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
        "lastUpdate": 1769444367155,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/2ji05um3swkxlqysdr70h/ImageToStl.com_Airbrush-IMAGE-ENHANCER-1768945509924-1768945509924.avif?rlkey=5cvtzsgy67fktx4om4qrphlco&st=ue9uf0aq&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 3",
        "isFinal": false
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
        "lastUpdate": 1769099807990,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/w5est8ffkgk3w7af0c4i0/ImageToStl.com_MV5BZjhmMjhkNjUtMGU2MC00N2IzLTg1YzItZDk5ODMxMDYxODc0XkEyXkFqcGc._V1.avif?rlkey=ytkpz6jwh00o8ikvdyf95l4pq&st=9mxw44sm&raw=1",
        "latestBlockName": "Temporada 1",
        "latestEpTitle": "Capítulo 13",
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
        "img": "https://www.dropbox.com/scl/fi/1jwtfdr7fniisbyk86ufq/ImageToStl.com_Airbrush-IMAGE-ENHANCER-1769436697375-1769436697376-1.avif?rlkey=7ykuw4c34w1dkr6wlnt2hmx82&st=nbyyeq8a&raw=1",
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
        "lastUpdate": 1769437840855,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://www.dropbox.com/scl/fi/oqkpyyqku4fr3ghwhzcr0/iruma3.avif?rlkey=g4yh1imo1v86ubsaeb4k541nk&st=2yuirrws&raw=1",
        "latestBlockName": "Temporada 3",
        "latestEpTitle": "Capítulo 21",
        "isFinal": true,
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
        "img": "https://api.pcloud.com/getpubthumb?code=XZLEwK5ZcndcdKwL4pftTTY5vsrHUhh3Vkc7&size=2000x3000",
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
        "lastUpdate": 1769990075138,
        "updateType": "NUEVO 🔥",
        "latestSeasonCover": "https://api.pcloud.com/getpubthumb?code=XZBEwK5ZjV7AT4DkE4YjShvLSJIRlLcMFJHV&size=2000x3000",
        "latestBlockName": "Temporada 2",
        "latestEpTitle": "Capítulo 25",
        "isFinal": true
    }
];