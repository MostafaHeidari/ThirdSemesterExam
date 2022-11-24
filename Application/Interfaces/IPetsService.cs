﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Domain;

namespace Application.Interfaces;

public interface IPetsService
{
    void Add(Pets p);
    void Update(Pets p);
    void Delete(Pets p);
    void GetAll();
    void GetById(int v);

    // all api methods from Interface class

    public void RebuildDB();
}