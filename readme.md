# Hópverkefni 1
## Höfundar
Höfundar þessa verkefnis eru
* Jóhannes Kári Sólmundarson -jks21@hi.is- `jaykaytherobot`
* Marcelo Felix Audibert -mfa5@hi.is- `Gitcelo`
* Sverrir Arnórsson -sva19@hi.is-  `sverrirarnors`
* Tryggvi Freyr Sigurgeirsson - tfs2@hi.is - `TryggviF`

## Uppsetning verkefnis
Til þess að setja upp verkefnið skal keyra skipunina npm install til þess að sækja öll dependency.
Verkefnið notast við Postgres, Cloudinary og JWT tokens, því þarf að skilgreina environment breytur í .env
Þær skulu vera á forminu:
* `DATABASE_URL=postgres://<username>:<password>@localhost/<dbnamehere>`
* `NODE_ENV=development` (Ef notandi vill ekki setja upp SSL)
* `JWT_SECRET=<secret name>`
* `JWT_TOKENLIFETIME=<token lifetime>`
* `CLOUDINARY_URL=cloudinary://<API KEY HERE>`
Einnig er krafa að notandi sé búinn að setja API key í system environment variables, sem er hægt að gera með CMD skipuninni

* `set CLOUDINARY_URL=cloudinary://<API KEY HERE>`

## Dæmi um köll í vefþjónustu
Öll requests sem notast við req.body notfæra raw JSON body í Postman, hér eru slík dæmi:
<img src= "./examples/Episode POST.png">
<img src = "./examples/rate PATCH.png">


## Innskráning sem almennur notandi:
Hægt er að fá bearer token sem almennur notandi með því að gera POST beiðni á `/users/login` með því að skila body með JSON gögnum:
* `"username": "notAdmin"`
* `"password": "0123456789"`
Þá skilar þjónustan token sem þarf síðan að skilgreina sem bearer token í þeim client sem maður notar við samskipti

## Innskráning sem stjórnandi:
Hægt er að fá bearer token sem stjórnandi með því að gera POST beiðni á `/users/login` með því að skila body með JSON gögnum:
* `"username": "admin"`
* `"password": "0123456789"`
Þá skilar þjónustan token sem þarf síðan að skilgreina sem bearer token í þeim client sem maður notar við samskipti

> Útgáfa 0.1