// Core
import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';

// Instruments
import './styles.css';
import { api } from '../API';
import { delay } from '../instruments';

// Hooks
import { useDebounce } from './useDebounce';

export const Search = hot(module)(() => {
    const [ filter, setFilter ] = useState('');
    const [ countries, setCountries ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);

    const selectFavoriteCountry = (country) => {
        setFilter(country.name);
    };

    const getCountries = async () => {
        try {
            setIsFetching(true);
            const filteredCountries = await api.getCountries(filter.trim());
            await delay(200);
            setCountries(filteredCountries);
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetching(false);
        }
    };

    const debouncedFilter = useDebounce(filter, 200);
    useEffect(() => void getCountries(), [ debouncedFilter ]);

    const regexp = new RegExp(filter, 'g');
    /**
     * dangerouslySetInnerHTML — ❌
     * dangerouslySetInnerHTML — ✅
     * 1. Рассмотрим юзкейс
     * 2. Годится для временных рамок формата воркшопа
     */
    const countriesJSX = countries.map((country) => {
        const name = country.name.replace(
            regexp,
            `<span class='highlight'>${filter}</span>`,
        );
        const continent = country.continent.replace(
            regexp,
            `<span class='highlight'>${filter}</span>`,
        );

        return (
            <li
                key = { country.emoji }
                onClick = { () => selectFavoriteCountry(country) }>
                <span
                    className = 'country'
                    dangerouslySetInnerHTML = {{
                        __html: `${name}, ${continent}`,
                    }}
                />
                <span className = 'flag'>{country.emoji}</span>
            </li>
        );
    });

    return (
        <section className = 'strange-search'>
            <span className = 'strange'>Странный</span>
            <input
                placeholder = 'Страна или континент'
                style = {{
                    '--inputBorderStyle': isFetching ? 'dashed' : 'solid',
                }}
                type = 'text'
                value = { filter }
                onChange = { (event) => setFilter(event.target.value) }
            />
            <span className = 'search'>поиск</span>
            <ul>{countriesJSX}</ul>
            <b />
        </section>
    );
});
