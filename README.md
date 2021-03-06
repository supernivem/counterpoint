# Cantus Firmus & Counterpoint

Author: Paolo Bordoni

University: Politecnico di Milano - M.Sc. Music and Acoustic Engineering

Subjects:
- *Advanced Coding Tools and Methodologies*, by Prof. Francesco Bruschi, Prof. Vincenzo Rana
- *Computer Music - Representations and Models*, by Prof. Augusto Sarti

Surge: http://counterpoint.surge.sh (updated to february 20th 2020)

Trailer: https://youtu.be/lihycwecfso (unfortunately audio is distort)

Tested on Chrome 79.0.3945.130 e FireFox 72.0.2 in Windows 10 environment.

## Overview

A **Cantus Firmus** (from Latin "fixed song") is a melody forming the basis of a polyphonic composition. The earliest polyphonic compositions almost always involved a cantus firmus, typically a *Gregorian chant*, a form of sacred song developed mainly in western and central Europe during the 9th and 10th centuries, which invention the popular legend credits to **pope Gregory the Great**.
This historical character, sitting on the left, will lead you into discover the rules in composing a well-sounding cantus firmus and will fix your mistakes.

**Counterpoint** is the relationship between voices in polyphonic compositions. The term originates from the Latin *punctus contra punctum* meaning "note against note". The rules followed by the voices are developed during the Renaissance and in the Baroque era.
One of the most famous polyphonic composer who worked on conterpont was **Giovanni Pierluigi da Palestrina**, who is standing on the right helping you in composing your voices.

## Technical aspects

The most challenging part of this project is the **automatic correction tool**, both of Cantus Firmus and Counterpoint. It is based on a *genetic algorithm* that, starting from your own composition (or even on a randomic one), it looks for a better one without errors. When a correct voice is found, the app provides it to you and allows you to listen to it.

### How the algorithm works

The genetic algorithm looks for a solution introducing time to time some changes in the composition according to the follow rules. For each note of the voice it:
- increases and decreases the note by one step with probability 50%
- increases and decreases the note by two steps with probability 30%
- increases and decreases the note by three steps with probability 20%
- besides, if the note is preceed or succeed by a leap greather than five steps, it sets a random note (that's because in these cases musical errors can be unlikely fixed by moving only a few steps).

So, for each individual of the population, `two * the length of the piece` mutations are added to the population. Then each mutation is evalutated by counting the number of musical errors it contains. The 20 candidates with less errors survive and the cicle is repeated until the best solution is not found.
(NB: in some cases the algotithm could not converge, so a limit of 20.000 attempts is setted in order to prevent infinite computations)

## Guide

The buttons on the top have respectively the follow funcions:
- Add new measure
- Remove the last measure
- Save the song
- Delete the song
- Import the saved song
- Enable/disable sharp (on a key-sharpened note it inserts natural note)
- Enable/disable flat (on a key-flattened note it inserts natural note)
- Check the current voice
- Fix the current voice
- Randomize the current voice
- Select the stave on which you want to compose the Cantus Firmus (only at beginning!)
- Swap from Cantus Firmus to Second Voice and vice versa

To change key signature (this can be done only on an empty score), select one of the accidentals (sharp or flat) and then click on the key area.

## Evolution

Currently, the app allows you to compose with counterpoint *of first species in two voices*: it means that the song is composed by two voices and there is a one-to-one relation between notes on Cantus Firmus and Counterpoint. Future updates may include the possibility of composing more than two voices and allow to explore Counterpoint in all species.
