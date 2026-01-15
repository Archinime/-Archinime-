const animes = [
    {
        "id": 1,
        "title": "DAN DA DAN",
        "img": "dan.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Sobrenatural",
            "Comedia",
            "Romance",
            "Comedia oscura",
            "Shōnen"
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        "aliases": [
            "Hotel Hazbin"
        ],
        "img": "hhzz.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Musical",
            "Drama",
            "Animación",
            "Policial",
            "Seijin"
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
        ]
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
        "aliases": [
            "Solo Camping for Two"
        ]
    },
    {
        "id": 54,
        "title": "Tōjima Tanzaburō wa Kamen Rider ni Naritai",
        "aliases": [
            "Tojima Wants to Be a Kamen Rider"
        ],
        "img": "tojima1.avif",
        "rating": 4.8,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Comedia",
            "Acción",
            "Tokusatsu",
            "Seinen"
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
        "aliases": [
            "Attack on Titan",
            "Shingeki no Kyojin"
        ],
        "img": "synt.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Acción",
            "Fantasía oscura",
            "Post-apocalíptico",
            "Drama",
            "Misterio",
            "Aventura",
            "Thriller",
            "Shōnen"
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
        "genres": [
            "Ciencia ficción",
            "Drama",
            "Misterio",
            "Thriller",
            "Deducción Social",
            "RPG",
            "Seinen"
        ]
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
        "title": "Frieren",
        "aliases": [
            "Sōsō no Frieren"
        ],
        "img": "ff.avif",
        "rating": 4.9,
        "uploader": "archinime12@gmail.com",
        "genres": [
            "Fantasía",
            "Aventura",
            "Drama",
            "Shōnen"
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
    }
];