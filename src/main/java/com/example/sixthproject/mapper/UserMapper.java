package com.example.sixthproject.mapper;


import com.example.sixthproject.dto.UserDTO;
import com.example.sixthproject.entity.User; // ⚠️ Өзіңнің Entity папкаңды дұрыс көрсет!
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface UserMapper {


    UserDTO toDto(User user);



    @Mapping(target = "password", ignore = true)

    User toEntity(UserDTO userDTO);
}