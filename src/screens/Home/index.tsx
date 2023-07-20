import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {

    //if necessary clear storage...
    //await AsyncStorage.clear();

    const dataKey = '@savepass:logins';
    try {
      const data = await AsyncStorage.getItem(dataKey);
      if (data != null){
        setData(JSON.parse(data))
        setSearchListData(JSON.parse(data));
      }
    } catch (e) {
      console.error('async storage load data error', e)
    }
  }

  function handleFilterLoginData() {
    if (searchText !== ''){
      const filteredList = searchListData.filter(item => {
        if (item.service_name.toLowerCase().includes(searchText.toLowerCase())){
          return item;
        }
      });
      setSearchListData(filteredList);
    }
  }

  function handleChangeInputText(text: string) {
    if (!text){
      setSearchListData(data);
    }
    setSearchText(text)
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Joatan',
          avatar_url: 'https:github.com/joatancavalcante.png'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              key={loginData.id}
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}