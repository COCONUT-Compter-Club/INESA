'use client'

import Navbar from "@/components/profile/Navbar"
import Home from "@/components/profile/Home"
import Prodes from "@/components/profile/Prodes"
import Vimis from "@/components/profile/Vimis"
import About from "@/components/profile/About"
import Location from "@/components/profile/Location"
import FAQSuratDesa from "@/components/profile/Accordion"
import FeatureCard from "@/components/profile/FeatureCard"
import Gallery from "@/components/profile/Gallery"
import StrukturDesaCard from "@/components/profile/StrukturDesa"
import StatistikPenduduk from "@/components/profile/JumlahPenduduk"
import Footer from "@/components/profile/Footer"

import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material"

let theme = createTheme({
    typography: {
        fontSize: 10
    }
})

theme = responsiveFontSizes(theme, { factor: 1 });

export default function Desa() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Navbar />
                <Home />
                <FeatureCard />
                <Prodes />
                <StrukturDesaCard />
                <Vimis />
                <Gallery />
                <About />
                <StatistikPenduduk />
                <FAQSuratDesa />
                <Location />
                <Footer />
            </div>
        </ThemeProvider>
    )
}