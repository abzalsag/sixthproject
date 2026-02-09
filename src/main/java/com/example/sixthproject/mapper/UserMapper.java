package com.example.sixthproject.mapper;


import com.example.sixthproject.dto.UserDTO;
import com.example.sixthproject.entity.User; // ⚠️ Өзіңнің Entity папкаңды дұрыс көрсет!
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// "spring" деген сөз бұл файлды @Service қылып тіркейді
@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity -> DTO (Құпия сөзді жасырып, сыртқа шығару үшін)
    UserDTO toDto(User user);

    // DTO -> Entity (Сырттан келген деректі базаға сақтау үшін)
    // password өрісі DTO-да жоқ болғандықтан, оны "ignore" жасаймыз немесе қолмен толтырамыз
    @Mapping(target = "password", ignore = true)
    // немесе егер role DTO-да жоқ болса, оны да ignore жасаймыз
    User toEntity(UserDTO userDTO);
}