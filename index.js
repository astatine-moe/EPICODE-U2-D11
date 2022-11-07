const maxPerArtist = 10;

const search = (query) => {
    return new Promise((resolve, reject) => {
        fetch(
            `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`
        )
            .then((res) => res.json())
            .then((json) => {
                const data = json.data;
                resolve(data);
            })
            .catch((err) => reject);
    });
};

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

$(async function () {
    const $container = $("#dynamic");

    //show 5 per search
    try {
        let pinkFloyd = await search("pink floyd"),
            daftPunk = await search("daft punk"),
            metallica = await search("metallica");

        $container.html("");

        pinkFloyd = pinkFloyd.slice(0, maxPerArtist);
        daftPunk = daftPunk.slice(0, maxPerArtist);
        metallica = metallica.slice(0, maxPerArtist);

        let allData = [...pinkFloyd, ...daftPunk, ...metallica];

        //sort all data by album name
        allData.sort((a, b) => {
            if (a.album.title < b.album.title) {
                return -1;
            }
            if (a.album.title > b.album.title) {
                return 1;
            }
            return 0;
        });

        console.log(allData);
        $("#total").text(allData.length);

        let albums = new Set();

        for (const item of allData) {
            const {
                album: { cover, title: albumTitle, cover_big },
                artist: { name, picture },
                duration,
                title: songTitle,
                link,
                preview,
            } = item;

            albums.add(albumTitle);

            const $col = $("<div>");
            $col.addClass("col-md-4");
            const $card = $("<div>");

            $card.addClass("card bg-dark text-white");
            const $img = $("<img>");
            $img.attr("src", cover_big);

            $card.append($img);

            const $body = $("<div>");
            $body.addClass("card-body");

            const $h5 = $("<h5>");
            $h5.addClass("card-title");
            $h5.text(songTitle);

            const $p = $("<p>");
            $p.addClass("card-text");
            $p.text(`Album name: ${albumTitle}`);

            const $audio = $("<audio>");
            const $src = $("<source>");

            $audio.attr("controls", true);
            $src.attr("src", preview);
            $src.attr("type", "audio/mpeg");

            $audio.append($src);

            const $button = $("<a>");
            $button.attr("href", link);
            $button.addClass("btn btn-primary");
            $button.text(`Go to track`);

            $body.append($h5, $p, $audio, $button);

            $card.append($body);

            $col.append($card);

            $container.append($col);

            //also append to list-group #song-list
            const $a = $("<a>");
            $a.attr("href", "#");
            $a.addClass(
                "list-group-item list-group-item-action flex-column align-items-start"
            );

            const $flex_container = $("<div>");
            $flex_container.addClass("d-flex w-100 justify-content-between");

            const $flex_inner = $("<div>");
            $flex_inner.addClass("d-flex");

            const $listHeading = $("<h5>");
            $listHeading.addClass("mb-1").text(songTitle);

            $flex_inner.append($listHeading);

            $flex_container.append($flex_inner);

            const $small = $("<small>");
            $small.text(fmtMSS(duration));

            $flex_container.append($small);

            $a.append($flex_container);

            $("#song-list").append($a);
        }

        $("#unique").text(albums.size);
    } catch (e) {
        alert("Failed loading results");
    }
});
